import { DndContext, PointerSensor, pointerWithin, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { animate, motion, useMotionValue } from "framer-motion";
import { Lightbulb, RotateCcw } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { stations, type Station, type StationId } from "../data/journey";
import { sortColumns, suggestedSort, type SortColumn } from "../data/sortAnswer";
import { useSlideState } from "../hooks/useSlideState";
import { theme } from "../theme";
import { Interactive, SlideButton } from "./Interactive";
import { useStageScale } from "./ScaledStage";

type Place = "tray" | SortColumn;

const COL_W = 350;
const GAP = 28;
const HEADER = 86;
const CARD_W = COL_W - 30;
const CARD_H = 66;
const STEP = 76;
export const BOARD_W = COL_W * 4 + GAP * 3;
export const BOARD_H = HEADER + stations.length * STEP + 12;

const places: Place[] = ["tray", "automate", "assist", "human"];
const colX = (p: Place) => places.indexOf(p) * (COL_W + GAP);

const header: Record<Place, { label: string; bg: string; fg: string }> = {
  tray: { label: "Journey stations", bg: "#E4EEF5", fg: theme.brandPrimary },
  automate: { label: sortColumns[0].label, bg: theme.agent, fg: "#fff" },
  assist: { label: sortColumns[1].label, bg: `linear-gradient(90deg, ${theme.human} 50%, ${theme.agent} 50%)`, fg: "#fff" },
  human: { label: sortColumns[2].label, bg: theme.human, fg: "#fff" },
};

const initialPlacement = () => Object.fromEntries(stations.map((s) => [s.id, "tray"])) as Record<StationId, Place>;

function Column({ place }: { place: Place }) {
  const { setNodeRef, isOver } = useDroppable({ id: place });
  const h = header[place];
  return (
    <div
      ref={setNodeRef}
      className="absolute top-0 rounded-3xl transition-colors"
      style={{
        left: colX(place),
        width: COL_W,
        height: BOARD_H,
        background: isOver ? "#FFF6E6" : place === "tray" ? "rgba(255,255,255,0.45)" : "#fff",
        boxShadow: isOver ? `0 0 0 4px ${theme.brandAccent}` : "0 1px 0 #C9DDEA",
        border: place === "tray" ? "2px dashed #C9DDEA" : undefined,
      }}
    >
      <div
        className="m-3 flex h-[62px] items-center justify-center rounded-2xl text-[30px] font-medium"
        style={{ background: h.bg, color: h.fg }}
      >
        {h.label}
      </div>
    </div>
  );
}

function Card({ station, place, slot }: { station: Station; place: Place; slot: number }) {
  const scale = useStageScale();
  const { setNodeRef, listeners, attributes, transform, isDragging } = useDraggable({ id: station.id });
  const target = { left: colX(place) + 15, top: HEADER + slot * STEP };
  const left = useMotionValue(target.left);
  const top = useMotionValue(target.top);
  const lastDelta = useRef({ x: 0, y: 0 });
  const wasDragging = useRef(false);

  if (transform) lastDelta.current = { x: transform.x / scale, y: transform.y / scale };

  useLayoutEffect(() => {
    if (isDragging) {
      wasDragging.current = true;
      return;
    }
    if (wasDragging.current) {
      // Start the settle animation from where the card was dropped, not its old slot.
      wasDragging.current = false;
      left.set(left.get() + lastDelta.current.x);
      top.set(top.get() + lastDelta.current.y);
      lastDelta.current = { x: 0, y: 0 };
    }
    const a = animate(left, target.left, { type: "spring", stiffness: 260, damping: 30 });
    const b = animate(top, target.top, { type: "spring", stiffness: 260, damping: 30 });
    return () => {
      a.stop();
      b.stop();
    };
  }, [target.left, target.top, isDragging, left, top]);

  const Icon = station.icon;
  const dot =
    place === "automate"
      ? theme.agent
      : place === "human"
        ? theme.human
        : place === "assist"
          ? `linear-gradient(90deg, ${theme.human} 50%, ${theme.agent} 50%)`
          : theme.brandSecondary;
  const dx = transform ? transform.x / scale : 0;
  const dy = transform ? transform.y / scale : 0;

  return (
    <motion.div className="absolute" style={{ left, top, width: CARD_W, height: CARD_H, zIndex: isDragging ? 50 : 1 }}>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        data-interactive
        className="flex h-full cursor-grab items-center gap-4 rounded-2xl bg-white px-4 active:cursor-grabbing"
        style={{
          transform: `translate(${dx}px, ${dy}px) scale(${isDragging ? 1.05 : 1})`,
          boxShadow: isDragging ? "0 18px 40px rgba(12,53,83,0.28)" : "0 2px 0 #C9DDEA, 0 4px 14px rgba(12,53,83,0.08)",
          touchAction: "none",
        }}
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full" style={{ background: dot }}>
          <Icon size={24} color="#fff" />
        </span>
        <span className="text-[25px] font-medium leading-tight" style={{ color: theme.ink }}>
          {station.name}
        </span>
      </div>
    </motion.div>
  );
}

/** Three columns (Automate, Assist, Keep human-led) with draggable station cards. */
export function SortBoard() {
  const [placement, setPlacement] = useSlideState<Record<StationId, Place>>("sortBoard", initialPlacement());
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const onDragEnd = (e: DragEndEvent) => {
    const to = e.over?.id as Place | undefined;
    if (!to) return;
    setPlacement((p) => ({ ...p, [e.active.id as StationId]: to }));
  };

  const slotOf = (id: StationId) => {
    const place = placement[id];
    return stations.filter((s) => placement[s.id] === place).findIndex((s) => s.id === id);
  };

  return (
    <Interactive className="flex flex-col items-center gap-6">
      <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragEnd={onDragEnd}>
        <div className="relative" style={{ width: BOARD_W, height: BOARD_H }}>
          {places.map((p) => (
            <Column key={p} place={p} />
          ))}
          {stations.map((s) => (
            <Card key={s.id} station={s} place={placement[s.id]} slot={slotOf(s.id)} />
          ))}
        </div>
      </DndContext>
      <div className="flex gap-4">
        <SlideButton tone="gold" className="!py-3 !text-[24px]" onClick={() => setPlacement({ ...suggestedSort })}>
          <Lightbulb size={26} /> Show a suggested answer
        </SlideButton>
        <SlideButton tone="ghost" className="!py-3 !text-[24px]" onClick={() => setPlacement(initialPlacement())}>
          <RotateCcw size={24} /> Reset
        </SlideButton>
      </div>
    </Interactive>
  );
}

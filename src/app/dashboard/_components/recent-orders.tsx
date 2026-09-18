import { formatDateRange, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { OrderDetail, RentalOrderStatus, Role } from "@/lib/validations/types";

const STATUS: Record<RentalOrderStatus, { label: string; className: string }> = {
  PLACED: { label: "Awaiting provider", className: "bg-gear-sun text-foreground" },
  CONFIRMED: { label: "Ready to pay", className: "bg-gear-sky text-foreground" },
  PAID: { label: "Paid", className: "surface-accent bg-lime text-ink" },
  PICKED_UP: { label: "Picked up", className: "bg-gear-sage text-foreground" },
  RETURNED: { label: "Returned", className: "bg-mist text-foreground" },
  CANCELLED: { label: "Cancelled", className: "bg-destructive/10 text-destructive" },
};

/** Status as words and colour, never colour alone. */
export function OrderStatusBadge({ status }: { status: RentalOrderStatus }) {
  const { label, className } = STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 font-mono text-[0.6rem] font-bold uppercase tracking-[0.16em]",
        className,
      )}
    >
      {label}
    </span>
  );
}

type RecentOrdersProps = {
  orders: OrderDetail[];
  /** Whose dashboard this is — decides which party each row names. */
  viewer: Role;
  emptyMessage: string;
};

function counterparty(order: OrderDetail, viewer: Role) {
  if (viewer === "CUSTOMER") return `From ${order.gearItem.provider.name}`;
  if (viewer === "PROVIDER") return `For ${order.customer.name}`;
  return `${order.customer.name} from ${order.gearItem.provider.name}`;
}

export function RecentOrders({ orders, viewer, emptyMessage }: RecentOrdersProps) {
  if (orders.length === 0) {
    return (
      <p className="border border-dashed border-ink/25 bg-card px-6 py-10 text-center text-sm leading-6 text-ink/65">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="divide-y divide-ink/10 border border-ink/15 bg-card">
      {orders.map((order) => (
        <li
          key={order.id}
          className="grid gap-3 px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6"
        >
          <div className="min-w-0">
            <p className="truncate font-bold">
              {order.gearItem.name}
              {order.quantity > 1 ? (
                <span className="font-normal text-ink/55"> × {order.quantity}</span>
              ) : null}
            </p>
            <p className="mt-1 text-xs leading-5 text-ink/60">
              {order.gearItem.category.name} · {counterparty(order, viewer)} ·{" "}
              {formatDateRange(order.startDate, order.endDate)}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <span className="font-mono text-sm font-bold">{formatMoney(order.totalPrice)}</span>
            <OrderStatusBadge status={order.status} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function SectionTitle({ id, kicker, title }: { id: string; kicker: string; title: string }) {
  return (
    <div className="mb-5">
      <p className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.18em] text-signal">
        {kicker}
      </p>
      <h2 id={id} className="mt-2 font-display text-4xl font-black uppercase tracking-[-0.03em]">
        {title}
      </h2>
    </div>
  );
}

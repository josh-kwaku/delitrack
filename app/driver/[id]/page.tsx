import { DriverInterface } from "@/components/driver/driver-interface"

export default function DriverPage({ params }: { params: { id: string } }) {
  return <DriverInterface deliveryId={params.id} />
}

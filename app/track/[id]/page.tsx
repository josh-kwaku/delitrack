import { CustomerTrackingView } from "@/components/customer/tracking-view"

export default function TrackingPage({ params }: { params: { id: string } }) {
  return <CustomerTrackingView deliveryId={params.id} />
}

import { GenericProductPage } from "@/components/product/generic-product-page"

export default function ProductPage({ params }: { params: Promise<{ category: string; product: string }> }) {
  return <GenericProductPage params={params} />
}

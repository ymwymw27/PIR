import { useEffect } from "react"
import { DEMO_MODE } from "../lib/supabase"
import { PRODUCT } from "../product"

export default function ProductHeader() {
  useEffect(() => {
    document.title = PRODUCT.name || "[제품 이름]"
  }, [])

  return (
    <header className="product-header">
      <h1 className={`t-display ${PRODUCT.name ? "" : "placeholder"}`}>
        {PRODUCT.name || "[제품 이름]"}
      </h1>
      <p className={`t-label ${PRODUCT.concept ? "" : "placeholder"}`}>
        {PRODUCT.concept || "[제품 컨셉, 한 줄]"}
      </p>
      <p
        className={`t-body product-description ${
          PRODUCT.description ? "" : "placeholder"
        }`}
      >
        {PRODUCT.description || "[제품 설명, 2~3문장]"}
      </p>
      {DEMO_MODE && (
        <p className="t-caption demo-note">데모 데이터로 표시 중</p>
      )}
    </header>
  )
}

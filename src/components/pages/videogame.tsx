import { Banner } from "~/components/games/banner"
import { Cards } from "~/components/games/cards"
import { Collage } from "~/components/games/collage"
import { MultipleCTA } from "~/components/games/multiple-cta"
import Header from "~/components/header"

export default function VideoGame() {
    return (
        <div
        className="min-h-screen font-sans antialiased bg-grid-pattern bg-mono-heavy text-mono-light"
        style={{
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <Header />
        <div className="grid-container">
          {Array.from({ length: 256 }, (_, i) => (
            <div key={i} className="grid-item" />
          ))}
        </div>
  
        <div className="shimmer-overlay" />
  
        {/* <div className="grid-lines" /> */}
        <div className="relative z-10">
            <Banner />
            <MultipleCTA />
            <Cards />
            <Collage />
           
        </div>
      </div>
    )
}
"use client"

// Generic interface for marquee items - any item with these properties can be used
type MarqueeItem = {
  image: string
  alt: string
  href: string
  title: string
}

type InfiniteMarqueeProps<T extends MarqueeItem> = {
  items: T[]
}

export default function InfiniteMarquee<T extends MarqueeItem>({ items }: InfiniteMarqueeProps<T>) {
  return (
    <div className="w-full overflow-hidden py-8">
      <div className="relative">
        {/* Desktop: Multiple items visible */}
        <div className="hidden md:block">
          <div className="flex animate-marquee-desktop">
            {/* First set of items */}
            {items.map((item, index) => (
              <MarqueeCard key={`first-${index}`} item={item} />
            ))}
            {/* Duplicate set for seamless loop */}
            {items.map((item, index) => (
              <MarqueeCard key={`second-${index}`} item={item} />
            ))}
          </div>
        </div>

        {/* Mobile: Single item visible */}
        <div className="block md:hidden">
          <div className="flex animate-marquee-mobile">
            {/* First set of items */}
            {items.map((item, index) => (
              <MarqueeCard key={`mobile-first-${index}`} item={item} isMobile />
            ))}
            {/* Duplicate set for seamless loop */}
            {items.map((item, index) => (
              <MarqueeCard key={`mobile-second-${index}`} item={item} isMobile />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

type MarqueeCardProps<T extends MarqueeItem> = {
  item: T
  isMobile?: boolean
}

function MarqueeCard<T extends MarqueeItem>({ item, isMobile = false }: MarqueeCardProps<T>) {
  return (
    <div className={`flex-shrink-0 ${isMobile ? "w-full px-4" : "w-80 mx-4"}`}>
      <a href={item.href} className="block group transition-transform duration-300 hover:scale-105">
        <div className="relative">
          <div className="aspect-[3/2] relative flex items-center justify-center h-full">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.alt}
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes={isMobile ? "100vw" : "320px"}
            />
          </div>
        </div>
      </a>
    </div>
  )
}

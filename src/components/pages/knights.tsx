import Header from "~/components/header"
import BrutalistHeader from "~/components/brutalist/header"
import BrutalistGallery from "~/components/brutalist/gallery"
import BrutalistInfo from "~/components/brutalist/info"
import BrutalistFooter from "~/components/brutalist/footer"

export default function Knights() {
  return (
    <main className="min-h-screen bg-white sword relative">
        <Header theme="dark" />
      <hr className="w-px bg-black h-full absolute left-[40%]"/>
      <hr className="w-[3px] bg-black h-full absolute right-[20%]"/>
      <BrutalistHeader />
      <BrutalistGallery />
      <BrutalistInfo />
      <BrutalistFooter />
    </main>
  )
}
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <section className="flex h-screen min-h-screen w-full">
      <Sidebar />
      <div className="flex-1">
        <div className="flex flex-col">
          <Header />
          {props.children}
        </div>
      </div>
    </section>
  );
}

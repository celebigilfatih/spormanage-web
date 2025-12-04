import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import GlobalChat from "@/components/GlobalChat";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["400","500","600","700","800"],
});

export const metadata: Metadata = {
  title: "Spormanage – Web Tabanlı Spor Yönetim Platformu",
  description: "Spormanage ile spor kulübünüzün üyelerini, finansını ve antrenmanlarını tek panelden yönetin.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${urbanist.variable} antialiased`}>
        {children}
        <GlobalChat />
        <script dangerouslySetInnerHTML={{__html: `(()=>{document.addEventListener('click',function(e){if(e.defaultPrevented)return;var t=e.target;while(t&&t.nodeType===1&&!t.matches('a[href]'))t=t.parentElement;if(!t)return;var href=t.getAttribute('href')||'';var target=t.getAttribute('target')||'';if(target==='_blank')return;try{var u=new URL(href,window.location.href);var sameOrigin=u.origin===window.location.origin;var samePath=u.pathname===window.location.pathname;var hasHash=(u.hash&&u.hash.length>1)||href.startsWith('#');if(hasHash&&sameOrigin&&samePath){e.preventDefault();var id=(u.hash||href).replace('#','');var el=document.getElementById(id);if(el){el.scrollIntoView({behavior:'smooth',block:'start'});history.pushState(null,'','#'+id);}return;}if(sameOrigin){e.preventDefault();document.body.classList.add('page-leave');setTimeout(function(){window.location.href=u.toString();},220);} }catch{if(href&&href.charAt(0)==='#'){e.preventDefault();var id=href.slice(1);var el=document.getElementById(id);if(el){el.scrollIntoView({behavior:'smooth',block:'start'});history.pushState(null,'',href);}}}}, { passive: false });})();`}} />
      </body>
    </html>
  );
}

import "./globals.css";
import { Providers } from "@/components/providers";
export const metadata = {
    title: "PMKVY Skill Gap Analyser - Pradhan Mantri Kaushal Vikas Yojana",
    description: "Identify gaps between your existing skills and industry requirements. Get personalized PMKVY training courses and career roadmaps.",
};
export default function RootLayout({ children, }) {
    return (<html lang="en">
      <body className="font-sans antialiased min-h-screen bg-white text-blue-950 selection:bg-blue-100 selection:text-blue-900">
        <Providers>{children}</Providers>
      </body>
    </html>);
}

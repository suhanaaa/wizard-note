import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wizard Notes - Sign in",
}
 
export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center">
        <SignIn appearance={{ variables: { colorPrimary:  '#0F172A' } } } />;
    </div>
  ) ;
}
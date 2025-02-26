import Content from "./Content";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/client";
const data = [
  { id: 1, title: "Title one", date: new Date().toDateString() },
  { id: 2, title: "Title two", date: new Date().toDateString() },
  { id: 3, title: "Title three", date: new Date().toDateString() },
];

export default async function Home() {
  const supabase = await createClient(); // Ensure the client is initialized properly
  const res =await supabase.auth.getUser();

  if(!res.data.user){
    redirect('/login');
  }
  
  return (
    <>
      <Content data={data} />;
    </>

    
  )
}
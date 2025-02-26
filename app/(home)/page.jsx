"use client"
import Content from "./Content";

const data = [
  { id: 1, title: "Title one", date: new Date().toDateString() },
  { id: 2, title: "Title two", date: new Date().toDateString() },
  { id: 3, title: "Title three", date: new Date().toDateString() },
];

export default function Home() {
  return <Content data={data} />;
}
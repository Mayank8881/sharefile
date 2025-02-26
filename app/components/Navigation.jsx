import Link from "next/link";
import React from "react";

const Navigation = () => {
  return (
    <nav className="bg-slate-800 text-white py-5 px-10 flex justify-between items-center">
      <Link href="/">
        <h3 className="font-bold text-xl">FileShare</h3>
      </Link>
      <ul className="flex space-x-4">
        <li>
          <Link href="/login">Login</Link>
        </li>
        <li>
          <Link href="/signup">Signup</Link>
        </li>
        <li>
          <button>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
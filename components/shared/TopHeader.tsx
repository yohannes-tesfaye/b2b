import Link from "next/link";
import { Mail, Phone } from "lucide-react";

function TopHeader() {
  return (
    <div className="px-[3%] flex text-nowrap justify-between items-center outline-1 outline-gray-300 py-3 text-[11px] lg:text-[12px] border-b">
      <div className="flex md:gap-5 gap-2">
        <div className="flex items-center gap-1">
          <Phone size={16} />
          <p>+251901964187</p>
        </div>
        <div className="text-gray-900">|</div>
        <div className="flex flex-row items-center gap-3">
          <Mail size={14} />
          <div className="pt-px">Hello@abc.com</div>
        </div>
      </div>

      <ul className="flex gap-3 items-center">
        <li>
          <Link href={"/faqs"}>Signin</Link>
        </li>
        <li className="text-gray-900">|</li>

        <li className="hidden lg:block">
          <Link href={"#footer"}>Join free</Link>
        </li>
        <li className="text-gray-900 hidden lg:block">|</li>

        <li>
          <Link href={"/contact"}>Contact us</Link>
        </li>
      </ul>
    </div>
  );
}

export default TopHeader;

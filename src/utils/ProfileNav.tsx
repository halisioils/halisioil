"use client";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";
import React from "react";
import { useProfileToggle } from "~/hooks/useDropdown";
import LoadingComponent from "./LoadingComponent";

const ProfileNav = () => {
  const { user, isLoading } = useKindeBrowserClient();

  const { closeProfile } = useProfileToggle();

  return (
    <nav
      className={`absolute -right-[1rem] top-[3rem] z-50 hidden h-auto w-[240px] rounded-[0.5rem] border-[1px] border-[#F2F4F7] bg-white text-[#333333] md:block`}
    >
      <ul className="flex flex-col">
        <li>
          <Link
            onClick={closeProfile}
            href={`/dashboard`}
            className="flex h-[40px] cursor-pointer items-center gap-[1rem] rounded-[0.5rem] px-[1rem] py-[0.625rem] text-[0.875rem] transition-all duration-300 ease-in-out hover:bg-gray-100"
          >
            <span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.50008 14.3753C7.1549 14.3753 6.87508 14.6551 6.87508 15.0003C6.87508 15.3455 7.1549 15.6253 7.50008 15.6253H12.5001C12.8453 15.6253 13.1251 15.3455 13.1251 15.0003C13.1251 14.6551 12.8453 14.3753 12.5001 14.3753H7.50008Z"
                  fill="#363636"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.0001 1.04199C9.40998 1.04199 8.87386 1.21101 8.29221 1.49386C7.72995 1.76728 7.08043 2.1704 6.26913 2.67393L4.54699 3.74274C3.77932 4.21917 3.16462 4.60066 2.69083 4.9635C2.20021 5.33923 1.82337 5.7219 1.55117 6.21918C1.27954 6.71543 1.15722 7.24344 1.09857 7.86758C1.04174 8.47244 1.04174 9.21209 1.04175 10.1397V11.4835C1.04174 13.0701 1.04173 14.3225 1.169 15.3017C1.29956 16.3061 1.57388 17.1171 2.19371 17.7582C2.8164 18.4023 3.6088 18.69 4.58975 18.8265C5.54049 18.9587 6.75472 18.9587 8.28495 18.9587H11.7152C13.2454 18.9587 14.4597 18.9587 15.4104 18.8265C16.3914 18.69 17.1838 18.4023 17.8064 17.7582C18.4263 17.1171 18.7006 16.3061 18.8312 15.3017C18.9584 14.3225 18.9584 13.0701 18.9584 11.4835V10.1397C18.9584 9.21211 18.9584 8.47243 18.9016 7.86758C18.8429 7.24344 18.7206 6.71543 18.449 6.21918C18.1768 5.7219 17.8 5.33923 17.3093 4.9635C16.8355 4.60066 16.2209 4.21917 15.4532 3.74275L13.731 2.67392C12.9197 2.1704 12.2702 1.76728 11.708 1.49386C11.1263 1.21101 10.5902 1.04199 10.0001 1.04199ZM6.89969 3.75376C7.74615 3.22842 8.34133 2.85994 8.83887 2.61799C9.3236 2.38226 9.6669 2.29199 10.0001 2.29199C10.3333 2.29199 10.6766 2.38226 11.1613 2.61799C11.6588 2.85994 12.254 3.22841 13.1005 3.75376L14.7671 4.78814C15.5678 5.28507 16.13 5.63478 16.5493 5.95591C16.9573 6.26836 17.192 6.52621 17.3525 6.81937C17.5135 7.11357 17.6076 7.45753 17.6571 7.98452C17.7078 8.52415 17.7084 9.20517 17.7084 10.1703V11.4378C17.7084 13.0803 17.7072 14.2513 17.5916 15.1406C17.4781 16.0139 17.2642 16.5206 16.9078 16.8894C16.5541 17.2552 16.0727 17.4723 15.2382 17.5884C14.3836 17.7072 13.2564 17.7087 11.6667 17.7087H8.33341C6.74381 17.7087 5.61661 17.7072 4.76193 17.5884C3.92746 17.4723 3.44603 17.2552 3.09241 16.8894C2.73592 16.5206 2.52209 16.0139 2.40857 15.1406C2.29299 14.2513 2.29175 13.0803 2.29175 11.4378V10.1703C2.29175 9.20517 2.29238 8.52415 2.34309 7.98452C2.39261 7.45753 2.48662 7.11357 2.64766 6.81937C2.80813 6.52621 3.04285 6.26836 3.45085 5.95591C3.87016 5.63478 4.43233 5.28507 5.23302 4.78814L6.89969 3.75376Z"
                  fill="#363636"
                />
              </svg>
            </span>
            Dashboard
          </Link>
        </li>
      </ul>
      {isLoading ? (
        <div className="flex h-[40px] w-[100%] items-center justify-center">
          <LoadingComponent />
        </div>
      ) : user ? (
        <LogoutLink
          onClick={closeProfile}
          className="flex h-[40px] cursor-pointer items-center gap-[1rem] rounded-[0.5rem] px-[1rem] py-[0.625rem] text-[0.875rem] transition-all duration-300 ease-in-out hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
          Logout
        </LogoutLink>
      ) : (
        <div className="grid grid-cols-1">
          <LoginLink
            className="flex h-[40px] cursor-pointer items-center gap-[1rem] rounded-[0.5rem] px-[1rem] py-[0.625rem] text-[0.875rem] transition-all duration-300 ease-in-out hover:bg-gray-100"
            onClick={closeProfile}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
            Sign in
          </LoginLink>
          <RegisterLink
            className="flex h-[40px] cursor-pointer items-center gap-[1rem] rounded-[0.5rem] px-[1rem] py-[0.625rem] text-[0.875rem] transition-all duration-300 ease-in-out hover:bg-gray-100"
            onClick={closeProfile}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
              />
            </svg>
            Sign up
          </RegisterLink>
        </div>
      )}
    </nav>
  );
};

export default ProfileNav;

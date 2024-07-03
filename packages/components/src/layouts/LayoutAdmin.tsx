export function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh">
      {/* SVGs para pantallas pequeñas */}
      <div className="absolute inset-0 md:hidden">
        <svg
          width="257"
          height="449"
          viewBox="0 0 257 449"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary sclae-large absolute"
          style={{ top: "0", left: "0" }}
        >
          <g filter="url(#filter0_d_11_20)">
            <path
              d="M-300.418 -100.886C-300.776 -113.95 -288.711 -123.842 -275.969 -120.929L218.426 -7.92429C234.635 -4.21924 239.508 16.4979 226.649 27.0396L-253.887 420.991C-266.745 431.532 -286.105 422.692 -286.559 406.07L-300.418 -100.886Z"
              fill="currentColor"
            />
          </g>
        </svg>

        <svg
          width="263"
          height="273"
          viewBox="0 0 263 273"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary absolute"
          style={{ top: "-15px", right: "0" }}
        >
          <path
            d="M221.85 -35.729C233.35 -45.3423 250.947 -39.3578 254.201 -24.7269L314.819 247.811C318.207 263.041 303.628 276.112 288.857 271.089L14.0313 177.623C-0.739679 172.6 -4.32682 153.351 7.64326 143.344L221.85 -35.729Z"
            fill="currentColor"
          />
        </svg>

        <svg
          width="214"
          height="314"
          viewBox="0 0 214 314"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-neutral absolute"
          style={{ top: "0", right: "0" }}
        >
          <path
            d="M221.507 5.269C233.007 -4.34429 250.603 1.64023 253.858 16.2711L314.476 288.809C317.864 304.039 303.285 317.11 288.514 312.087L13.6881 218.621C-1.08285 213.598 -4.66999 194.349 7.30008 184.342L221.507 5.269Z"
            fill="currentColor"
            fillOpacity="0.6"
          />
        </svg>

        <svg
          width="250"
          height="250"
          viewBox="0 0 411 429"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-neutral absolute"
          style={{ bottom: "0", right: "0" }}
        >
          <path
            d="M528.093 525.541C528.871 538.588 517.131 548.863 504.303 546.362L6.52339 449.346C-9.79704 446.165 -15.3345 425.616 -2.8222 414.665L464.77 5.43545C477.283 -5.51516 496.917 2.69711 497.907 19.2952L528.093 525.541Z"
            fill="currentColor"
            fillOpacity="0.6"
          />
        </svg>

        <svg
          width="263"
          height="295"
          viewBox="0 0 263 327"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary absolute"
          style={{ bottom: "0", left: "-15px" }}
        >
          <path
            d="M22.8606 323.505C11.6032 333.401 -6.13681 327.854 -9.75296 313.309L-77.1132 42.3578C-80.8774 27.2169 -66.6272 13.7882 -51.7361 18.4437L225.323 105.063C240.214 109.719 244.278 128.873 232.56 139.174L22.8606 323.505Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* SVGs para pantallas grandes */}
      <div className="absolute inset-0 hidden md:block">
        <svg
          width="514"
          height="898"
          viewBox="0 0 257 449"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary absolute"
          style={{ top: "-100px", left: "0" }}
        >
          <g filter="url(#filter0_d_11_20)">
            <path
              d="M-300.418 -100.886C-300.776 -113.95 -288.711 -123.842 -275.969 -120.929L218.426 -7.92429C234.635 -4.21924 239.508 16.4979 226.649 27.0396L-253.887 420.991C-266.745 431.532 -286.105 422.692 -286.559 406.07L-300.418 -100.886Z"
              fill="currentColor"
            />
          </g>
        </svg>

        <svg
          width="526"
          height="546"
          viewBox="0 0 263 273"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary absolute"
          style={{ top: "-150px", right: "0" }}
        >
          <path
            d="M221.85 -35.729C233.35 -45.3423 250.947 -39.3578 254.201 -24.7269L314.819 247.811C318.207 263.041 303.628 276.112 288.857 271.089L14.0313 177.623C-0.739679 172.6 -4.32682 153.351 7.64326 143.344L221.85 -35.729Z"
            fill="currentColor"
          />
        </svg>

        <svg
          width="428"
          height="628"
          viewBox="0 0 214 314"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-neutral absolute"
          style={{ top: "-140px", right: "0" }}
        >
          <path
            d="M221.507 5.269C233.007 -4.34429 250.603 1.64023 253.858 16.2711L314.476 288.809C317.864 304.039 303.285 317.11 288.514 312.087L13.6881 218.621C-1.08285 213.598 -4.66999 194.349 7.30008 184.342L221.507 5.269Z"
            fill="currentColor"
            fillOpacity="0.6"
          />
        </svg>

        <svg
          width="500"
          height="500"
          viewBox="0 0 411 429"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-neutral absolute"
          style={{ bottom: "-110px", right: "0" }}
        >
          <path
            d="M528.093 525.541C528.871 538.588 517.131 548.863 504.303 546.362L6.52339 449.346C-9.79704 446.165 -15.3345 425.616 -2.8222 414.665L464.77 5.43545C477.283 -5.51516 496.917 2.69711 497.907 19.2952L528.093 525.541Z"
            fill="currentColor"
            fillOpacity="0.6"
          />
        </svg>

        <svg
          width="263"
          height="327"
          viewBox="0 0 263 327"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary absolute"
          style={{ bottom: "-110px", left: "0" }}
        >
          <path
            d="M22.8606 323.505C11.6032 333.401 -6.13681 327.854 -9.75296 313.309L-77.1132 42.3578C-80.8774 27.2169 -66.6272 13.7882 -51.7361 18.4437L225.323 105.063C240.214 109.719 244.278 128.873 232.56 139.174L22.8606 323.505Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Children */}
      <div className="relative my-auto flex w-full flex-col items-center">
        <main className="mt-14 w-full max-w-md space-y-4 rounded-lg py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

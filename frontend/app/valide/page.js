'use client'

import ContentsToValidate from "@/components/shared/ContentsToValidate";
import NotAuthorized from "@/components/shared/NotAuthorized";

import { useAppContext } from "@/contexts/appContext";



const page = () => {

    const {
        address,
        isConnected,
        profile

    } = useAppContext();

 


    return (
        <>

            {(profile == 2 && isConnected) ? (
                <>
                    <div className="flex flex-wrap -mx-4 -mb-4 md:mb-0">
                        <div className="w-full md:w-3/4 px-4 mb-4 md:mb-0">
                            <section className="p-8 py-6 bg-gray-500">
                                <div className="flex flex-wrap items-center justify-between pb-4 -mx-2">
                                    <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                                        <div className="flex flex-wrap items-end">
                                            <div className="w-auto mr-3">
                                                <h2 className="text-lg font-semibold text-white">Recent publications</h2>
                                            </div>
                                            <div className="relative bottom-px pb-px w-auto">
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/2 px-2">
                                        <div className="relative md:max-w-max md:ml-auto">
                                            <svg className="absolute left-3 transform top-1/2 -translate-y-1/2" width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14.0467 11.22L12.6667 9.80667C12.3699 9.5245 11.9955 9.33754 11.5916 9.26983C11.1876 9.20211 10.7727 9.25673 10.4001 9.42667L9.80008 8.82667C10.5071 7.88194 10.83 6.70445 10.7038 5.53122C10.5775 4.358 10.0115 3.27615 9.1197 2.50347C8.22787 1.73078 7.07643 1.32464 5.89718 1.36679C4.71794 1.40894 3.59844 1.89626 2.76405 2.73065C1.92967 3.56503 1.44235 4.68453 1.4002 5.86378C1.35805 7.04302 1.76419 8.19446 2.53687 9.08629C3.30956 9.97812 4.3914 10.5441 5.56463 10.6704C6.73786 10.7966 7.91535 10.4737 8.86007 9.76667L9.45341 10.36C9.26347 10.7331 9.1954 11.1564 9.25879 11.5702C9.32218 11.984 9.51383 12.3675 9.80674 12.6667L11.2201 14.08C11.5951 14.4545 12.1034 14.6649 12.6334 14.6649C13.1634 14.6649 13.6717 14.4545 14.0467 14.08C14.2372 13.8937 14.3886 13.6713 14.4919 13.4257C14.5953 13.1802 14.6485 12.9164 14.6485 12.65C14.6485 12.3836 14.5953 12.1198 14.4919 11.8743C14.3886 11.6287 14.2372 11.4063 14.0467 11.22ZM8.39341 8.39333C7.9269 8.85866 7.33294 9.1753 6.68657 9.30323C6.0402 9.43117 5.37041 9.36466 4.76181 9.11212C4.15321 8.85958 3.63312 8.43234 3.26722 7.88436C2.90132 7.33638 2.70603 6.69224 2.70603 6.03333C2.70603 5.37442 2.90132 4.73029 3.26722 4.18231C3.63312 3.63433 4.15321 3.20708 4.76181 2.95454C5.37041 2.702 6.0402 2.6355 6.68657 2.76343C7.33294 2.89137 7.9269 3.208 8.39341 3.67333C8.70383 3.98297 8.95012 4.35081 9.11816 4.75577C9.2862 5.16074 9.3727 5.59488 9.3727 6.03333C9.3727 6.47178 9.2862 6.90592 9.11816 7.31089C8.95012 7.71586 8.70383 8.08369 8.39341 8.39333ZM13.1067 13.1067C13.0448 13.1692 12.971 13.2187 12.8898 13.2526C12.8086 13.2864 12.7214 13.3039 12.6334 13.3039C12.5454 13.3039 12.4583 13.2864 12.377 13.2526C12.2958 13.2187 12.2221 13.1692 12.1601 13.1067L10.7467 11.6933C10.6843 11.6314 10.6347 11.5576 10.6008 11.4764C10.567 11.3951 10.5495 11.308 10.5495 11.22C10.5495 11.132 10.567 11.0449 10.6008 10.9636C10.6347 10.8824 10.6843 10.8086 10.7467 10.7467C10.8087 10.6842 10.8825 10.6346 10.9637 10.6007C11.0449 10.5669 11.1321 10.5495 11.2201 10.5495C11.3081 10.5495 11.3952 10.5669 11.4765 10.6007C11.5577 10.6346 11.6314 10.6842 11.6934 10.7467L13.1067 12.16C13.1692 12.222 13.2188 12.2957 13.2527 12.3769C13.2865 12.4582 13.3039 12.5453 13.3039 12.6333C13.3039 12.7213 13.2865 12.8085 13.2527 12.8897C13.2188 12.971 13.1692 13.0447 13.1067 13.1067Z" fill="#BBC3CF" />
                                            </svg>
                                            <input className="w-full md:w-64 pl-8 pr-4 py-2 text-sm text-coolGray-400 font-medium outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input" type="text" placeholder="Search" />
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b border-coolGray-100" />
                            </section>
                        </div>
                        <div className="w-full md:w-1/4 px-4 mb-4 md:mb-0 pr-10">
                            <a href="/contribute/propose"><button className="inline-block text-lg font-medium text-center focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 border-transparent rounded-md shadow-sm h-full w-full border bg-orange-300 text-white hover:bg-orange-600 " type="submit" >Propose A New Content</button> </a>
                        </div>

                    </div>
                    <ContentsToValidate />
                </>
            ) : (
                <NotAuthorized />
            )

            }



        </>
    )
}

export default page
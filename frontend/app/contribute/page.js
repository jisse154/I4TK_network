'use client'

import ProposeForm from "@/components/shared/ProposeForm";
import { useAppContext } from "@/contexts/appContext";
import NotAuthorized from "@/components/shared/NotAuthorized";




const page = () => {
    const {
        address,
        isConnected,
        profile

    } = useAppContext();

 


    return (
        <>

            {((profile == 2 || profile == 1) && isConnected) ? (
                <>
                    
                    <ProposeForm />
                </>
            ) : (
                <NotAuthorized />
            )

            }



        </>
    )
}

export default page
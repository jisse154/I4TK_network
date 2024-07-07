'use client'

import ProposeForm from "@/components/shared/ProposeForm";
import { UseAppContext } from "@/contexts/AppContext";
import NotAuthorized from "@/components/shared/NotAuthorized";




const page = () => {
    const {
        address,
        isConnected,
        profile

    } = UseAppContext();

 


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
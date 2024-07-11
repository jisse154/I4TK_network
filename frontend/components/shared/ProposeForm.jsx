'use client'

import { useEffect, useState } from "react";
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { I4TKnetworkAddress, I4TKnetworkABI, I4TKTokenAddress, I4TKTokenABI } from "@/constants";
import { useToast } from "@/components/ui/use-toast";

const ProposeForm = () => {

    const { address } = useAccount();
    const { toast } = useToast();


    const categories = [
        'Catégorie 1',
        'Catégorie 2',
        'Catégorie 3',
        'Catégorie 4',
    ];


    const [selectedCategories, setSelectedCategories] = useState([]);
    const [tokenMetadata, setTokenMetadata] = useState({ tokenId: '', tokenCID: '', tokenTitle: '', tokenDescription: '', tokenAuthors: '', tokenProgramme: '', tokenCategories: [] });
    //const [URIRequest, setURIRequest] = useState({ tokenId: '', tokenCID: '', tokenTitle: '', tokenDescription: '', tokenAuthors: '', tokenProgramme: '', tokenCategories: [] });
    const [newTokenId, setNewTokenId] = useState();


    // État pour les valeurs des inputs et les lignes de la table
    const [inputValues, setInputValues] = useState({ token: '', title: '', CID: '' });
    const [sourceTokens, setSourceTokens] = useState([]);
    const [sourceToken, setSourceToken] = useState([]);
    const [rows, setRows] = useState([]);


    // Fonction pour ajouter une ligne à la table
    const addRow = () => {
        
        event.preventDefault(); // Empêcher le rechargement de la page
        const { token, title, CID } = inputValues;
        console.log(token);
        if (token.trim() !== '' && Number.isInteger(parseInt(token, 10))) {
            setSourceToken(token);
            setRows([...rows, inputValues]);
            // Réinitialiser les inputs

            setSourceTokens([...sourceTokens, parseInt(token, 10)]);
            console.log(sourceTokens)
            setSourceToken([]);
            setInputValues({ token: '', title: '', CID: '' });
        }
        else {
            toast({
                title: "Error",
                description: "Please enter a correct number",
                className: 'bg-red-600'
            });
        };

    };


    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        let updatedSelection;

        if (checked) {
            updatedSelection = [...selectedCategories, value];
        } else {
            updatedSelection = selectedCategories.filter(category => category !== value);
        }
        setSelectedCategories(updatedSelection);
        setTokenMetadata({ ...tokenMetadata, tokenCategories: updatedSelection });

    };


    // Fonction pour mettre à jour les valeurs des inputs
    const handleSourceChange = (e) => {
        const { name, value } = e.target;
        setInputValues({ ...inputValues, [name]: value });
    };


    const handleFormChange = (e) => {

        const { name, value } = e.target;
        setTokenMetadata({ ...tokenMetadata, [name]: value });

    };

    const { data: hash, isPending,isError, error, writeContract } = useWriteContract();


    const { data: lastTokenId, isSuccess: isLastTokenidSucess, refetch: refretchLastTokenId } = useReadContract({
        abi: I4TKTokenABI,
        address: I4TKTokenAddress,
        functionName: 'lastTokenId',
        args: [],
        account: address,
    });

    const { data: tokenURI, isSuccess: isFormatURISuccess, refetch: refrechtokenURI } = useReadContract({
        abi: I4TKTokenABI,
        address: I4TKTokenAddress,
        functionName: 'formatTokenURI',
        args: [newTokenId, tokenMetadata.tokenCID, tokenMetadata.tokenTitle, tokenMetadata.tokenAuthors, tokenMetadata.tokenDescription, tokenMetadata.tokenProgramme, tokenMetadata.tokenCategories],
        account: address,
    }

    );


    useEffect(() => {

        if (lastTokenId !== undefined) {
            console.log(Number(lastTokenId));


            setNewTokenId(Number(lastTokenId) + 1);
            setTokenMetadata({ ...tokenMetadata, tokenId: (Number(lastTokenId) + 1) });

        }


    }, [lastTokenId]);


    const propose = async () => {

        console.log("proposed !!");
        console.log(sourceTokens);
        console.log(tokenMetadata);


        writeContract({
            address: I4TKnetworkAddress,
            abi: I4TKnetworkABI,
            functionName: 'proposeContent',
            account: address,
            args: [tokenURI, sourceTokens]
        })

    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    useEffect(() => {
        if (isConfirming) {

            toast({
                title: "transaction in progress",
                description: "tx hash :" + hash ,
                className: 'bg-orange-200'
            });

        }

    }, [isConfirming])

    useEffect(() => {
        if (isConfirmed) {

            toast({
                title: "transaction validated",
                description: "New content proposed!!",
                className: 'bg-green-600'
            });

            cancel();
        }

    }, [isConfirmed])

    useEffect(() => {
        if (isError !== undefined && error !== null) {


            toast({
                title: "transaction Error",
                description: "error :  " + error,
                className: 'bg-red-500'
            });

        }

    }, [isError])


    const cancel = () => {
        setInputValues({ token: '', title: '', CID: '' });
        setRows([]);
        setSelectedCategories([]);
        setTokenMetadata({ tokenId: '', tokenCID: '', tokenTitle: '', tokenDescription: '', tokenAuthors: '', tokenProgramme: '', tokenCategories: [] });
        refretchLastTokenId()


    }

    return (
        <form className="m-5">
            <div className="space-y-6">
                <div className="border-b border-gray-900/10 pb-12">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="mb-4 text-3xl md:text-4xl font-heading font-bold">Propose Content</h2>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Please enter all informations needed:
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                IPFS CID:
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">ipfs/</span>
                                    <input
                                        type="text"
                                        name="tokenCID"
                                        id="CID"
                                        value={tokenMetadata.tokenCID}
                                        onChange={handleFormChange}
                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        placeholder="CID"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="sm:col-span-4">
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                Title
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">

                                    <input
                                        type="text"
                                        name="tokenTitle"
                                        id="title"
                                        value={tokenMetadata.tokenTitle}
                                        onChange={handleFormChange}
                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        placeholder="title"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                                Description
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="description"
                                    name="tokenDescription"
                                    rows={6}
                                    value={tokenMetadata.tokenDescription}
                                    onChange={handleFormChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"

                                />
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                                Authors
                            </label> <span className="text-sm italic font-small">enter the list of authors seperated by a comma</span>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="tokenAuthors"
                                    id="authors"
                                    value={tokenMetadata.tokenAuthors}
                                    onChange={handleFormChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                Programme
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">

                                    <input
                                        type="text"
                                        name="tokenProgramme"
                                        id="programme"
                                        value={tokenMetadata.tokenProgramme}
                                        onChange={handleFormChange}
                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        placeholder="programme name"
                                    />
                                </div>
                            </div>
                        </div>



                    </div>

                    <div className="pb-5 mt-5">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Categories</h2>

                        <div className="mt-1 space-y-0.5">
                            <fieldset>
                                <div className="mt-2 grid grid-cols-3 space-y-0.5">

                                    {categories.map(category => (
                                        <div key={category} className="relative flex gap-x-3">
                                            <div className="flex h-6 items-center">
                                                <input
                                                    type="checkbox"
                                                    value={category}
                                                    onChange={handleCheckboxChange}
                                                    checked={selectedCategories.includes(category)}

                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                />
                                            </div>
                                            <div className="text-sm leading-6">
                                                <label htmlFor="comments" className="font-medium text-gray-900">
                                                    {category}
                                                </label>
                                            </div>
                                        </div>
                                    )
                                    )}

                                </div>
                            </fieldset>

                        </div>
                    </div>
                </div>



                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Sources</h2>

                    <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                token Id
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="token"

                                    value={inputValues.token}
                                    onChange={handleSourceChange}
                                    placeholder="Enter token ID"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3 content-end">

                            <button
                                type="button"
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
                                onClick={addRow}
                            >
                                Add
                            </button>
                            <button
                                type="button"
                                className=" ml-5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
                                onClick={() => { setRows([]); setInputValues({ token: '', title: '', CID: '' }); setSourceTokens([]); }}
                            >
                                Reset
                            </button>
                        </div>
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Token</th>
                                        <th>Title</th>
                                        <th>CID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.token}</td>
                                            <td>{row.title}</td>
                                            <td>{row.CID}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>



                    </div>
                </div>


            </div>

            <div className="text-pretty break-words ">
                <h3>TokenURI :</h3>
                <p>{tokenURI}</p>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="button"
                    onClick={cancel}
                    className="text-sm font-semibold leading-6 text-gray-900">
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={propose}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Propose
                </button>
            </div>
        </form>
    )
}

export default ProposeForm
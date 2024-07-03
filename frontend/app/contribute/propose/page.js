'use client'

import { useState } from "react";
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'


const page = () => {

    // État pour les valeurs des inputs et les lignes de la table
    const [inputValues, setInputValues] = useState({ token: '', title: '', CID: '' });
    const [rows, setRows] = useState([]);

    // Fonction pour ajouter une ligne à la table
    const addRow = () => {
        event.preventDefault(); // Empêcher le rechargement de la page
        const { token, title, CID } = inputValues;
        if (token.trim() !== '') {

            setRows([...rows, inputValues]);
            setInputValues({ token: '', title: '', CID: '' }); // Réinitialiser les inputs
        }
    };

    // Fonction pour mettre à jour les valeurs des inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValues({ ...inputValues, [name]: value });
    };

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
                                        name="CID"
                                        id="CID"
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
                                        name="CID"
                                        id="CID"
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
                                    id="about"
                                    name="about"
                                    rows={3}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    defaultValue={''}
                                />
                            </div>
                            <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                                Authors
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="street-address"
                                    id="street-address"
                                    autoComplete="street-address"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                    </div>
                </div>

                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Sources</h2>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                token Id
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="token"

                                    value={inputValues.token}
                                    onChange={handleChange}
                                    placeholder="Enter token ID"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3 content-end">

                            <button
                                type="submit"
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
                                onClick={addRow}
                            >
                                Add
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

                <div className="border-b border-gray-900/10 pb-5">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Categories</h2>

                    <div className="mt-1 space-y-0.5">
                        <fieldset>
                            <div className="mt-2 grid grid-cols-3 space-y-0.5">
                                <div className="relative flex gap-x-3">
                                    <div className="flex h-6 items-center">
                                        <input
                                            id="comments"
                                            name="comments"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="comments" className="font-medium text-gray-900">
                                            cat1
                                        </label>
                                    </div>
                                </div>
                                <div className="relative flex gap-x-3">
                                    <div className="flex h-6 items-center">
                                        <input
                                            id="candidates"
                                            name="candidates"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="candidates" className="font-medium text-gray-900">
                                            cat2
                                        </label>
                                    </div>
                                </div>
                                <div className="relative flex gap-x-3">
                                    <div className="flex h-6 items-center">
                                        <input
                                            id="offers"
                                            name="offers"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="offers" className="font-medium text-gray-900">
                                            cat3
                                        </label>

                                    </div>
                                </div>
                                <div className="relative flex gap-x-3">
                                    <div className="flex h-6 items-center">
                                        <input
                                            id="offers"
                                            name="offers"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="offers" className="font-medium text-gray-900">
                                            cat4
                                        </label>

                                    </div>
                                </div>
                                <div className="relative flex gap-x-3">
                                    <div className="flex h-6 items-center">
                                        <input
                                            id="offers"
                                            name="offers"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="offers" className="font-medium text-gray-900">
                                            cat5
                                        </label>

                                    </div>
                                </div>
                            </div>
                        </fieldset>

                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                    Cancel
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Propose
                </button>
            </div>
        </form>
    )
}

export default page
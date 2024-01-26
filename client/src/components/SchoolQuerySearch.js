import { useEffect, useState } from 'react'

export const SchoolQuerySearch = ({ value, handleSearch }) => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const hasResults = results.length > 0

    const [timerId, setTimerId] = useState(null)
    const TIMER_DELAY = 500 // milliseconds

    useEffect(() => {
        // Cleanup the timer on component unmount
        return () => {
            if (timerId) {
                clearTimeout(timerId)
            }
        }
    }, [timerId])

    // initialize school if one exists
    useEffect(() => {
        value ? setQuery(value) : setQuery('')
    }, [value])

    const fetchSchools = async (query) => {
        // edge case: empty query
        if (query === '') return

        try {
            const response = await fetch(
                `http://universities.hipolabs.com/search?name=${query}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )

            if (!response.ok) {
                // Check if the response has JSON content
                if (
                    response.headers
                        .get('content-type')
                        ?.includes('application/json')
                ) {
                    const errorData = await response.json()
                    throw new Error(`${errorData.error}`)
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
            }

            const data = await response.json()

            // Remove duplicates based on the "name" property
            const uniqueResults = data.reduce((unique, school) => {
                if (!unique.find((item) => item.name === school.name)) {
                    unique.push(school)
                }
                return unique
            }, [])

            setResults(uniqueResults)
        } catch (error) {
            console.error(error.message)
        }
    }

    const handleInputChange = (event) => {
        const newQuery = event.target.value

        // Clear the existing timer
        if (timerId) {
            clearTimeout(timerId)
        }

        // edge case: empty query
        if (newQuery === '') {
            setQuery('')
            setResults([])

            // clear current search
            handleSearch('')
            return
        }

        // Set a new timer to fetch schools after a certain delay
        const newTimerId = setTimeout(() => {
            fetchSchools(newQuery)
        }, TIMER_DELAY) // Adjust the delay time as needed (in milliseconds)

        // Update the state with the new query and timer ID
        setQuery(newQuery)
        setTimerId(newTimerId)
    }

    const handleSchoolButtonClick = (school) => {
        // clear results
        setQuery(school.name)
        setResults([])

        // Handle the school button click
        handleSearch(school.name)
    }

    return (
        <>
            <form
                className={`flex w-full flex-col items-center justify-center ${hasResults ? 'relative' : ''}`}
                onSubmit={(e) => e.preventDefault()} // Prevent form submission
            >
                <input
                    className={
                        'z-20 w-full rounded-full bg-gray-100 px-4 py-2 text-gray-800 outline-none'
                    }
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Harvard University"
                />
                <div
                    className={`z-10 max-h-36 w-full -translate-y-4 overflow-y-scroll bg-white shadow-md ${hasResults ? 'absolute top-full' : ''}`}
                >
                    {hasResults &&
                        results.map((school) => (
                            <div
                                key={`${school.name}_result`}
                                className="flex flex-row items-center justify-center px-5 py-2 hover:bg-gray-100"
                            >
                                <button
                                    key={`school_button_${school.name}`} // Add a unique key for each button
                                    className="h-16 w-full p-5 text-start"
                                    onClick={() =>
                                        handleSchoolButtonClick(school)
                                    }
                                >
                                    <h1>{school.name}</h1>
                                </button>
                            </div>
                        ))}
                </div>
            </form>
        </>
    )
}

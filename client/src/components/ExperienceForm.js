import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ExperienceQuerySearchInput } from './ExperienceQuerySearchInput'
import { TitleQuerySearchInput } from './TitleQuerySearchInput'

export const ExperienceForm = ({
    experience,
    index,
    updateExperience,
    removeExperience,
    setIsValid,
    setIsValidPresent,
}) => {
    const [company, setCompany] = useState('')
    const [title, setTitle] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [isPresent, setIsPresent] = useState(false)

    // initialize experience if one exists
    useEffect(() => {
        if (experience) {
            setCompany(experience.company)
            setTitle(experience.title)

            let start, end

            // Check if date property exists and is not empty
            if (experience.date && experience.date !== '') {
                ;[start, end] = experience.date.split('-')

                start = start.trim()
                end = end.trim()
            } else {
                // Set default values if date is empty or undefined
                ;[start, end] = ['', '']
            }

            setStartDate(convertDateFormat(start))
            setEndDate(convertDateFormat(end))
        }
    }, [experience])

    useEffect(() => {
        const currentDate = new Date()

        if (isPresent && new Date(startDate) > currentDate) {
            setIsValidPresent(false)
        } else {
            setIsValidPresent(true)
        }

        // Validation logic here
        if (endDate < startDate) {
            setIsValid(false)
        } else {
            setIsValid(true)
        }
    }, [endDate, startDate, isPresent, setIsValid, setIsValidPresent])

    function flipDateFormat(inputDate) {
        // Parse the input date string
        const [year, month] = inputDate.split('-')

        // Convert the month from numeric to textual representation
        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ]
        const monthText = monthNames[parseInt(month, 10) - 1]

        // Combine the month and year into the desired format
        const outputDate = `${monthText} ${year}`

        return outputDate
    }

    function convertDateFormat(inputDate) {
        // edge case: blank date
        if (inputDate === '') {
            return ''
        }

        // Split the input date string into month and year
        const [month, year] = inputDate.split(' ')

        // Convert the month from textual to numeric representation
        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ]
        const monthNumeric = monthNames.indexOf(month) + 1

        // Pad the month with a leading zero if needed
        const paddedMonth =
            monthNumeric < 10 ? `0${monthNumeric}` : `${monthNumeric}`

        // Combine the month and year into the desired format
        const outputDate = `${year}-${paddedMonth}`

        return outputDate
    }

    const handleExperienceChange = (e, field) => {
        const value = e.target.value

        if (field === 'startDate') {
            setStartDate(value)

            const newExperience = {
                company,
                title,
                date: `${flipDateFormat(value)} - ${isPresent ? 'Present' : flipDateFormat(endDate)}`,
            }

            updateExperience(newExperience, index)
        } else if (field === 'endDate') {
            setEndDate(value)

            const newExperience = {
                company,
                title,
                date: `${flipDateFormat(startDate)} - ${flipDateFormat(value)}`,
            }

            updateExperience(newExperience, index)
        }
    }

    const handleCompanyChange = async (value) => {
        setCompany(value)

        const newExperience = {
            company: value,
            title,
            date: `${flipDateFormat(value)} - ${flipDateFormat(endDate)}`,
        }

        updateExperience(newExperience, index)
    }

    const handleTitleChange = async (value) => {
        setTitle(value)

        const newExperience = {
            company,
            title: value,
            date: `${flipDateFormat(startDate)} - ${flipDateFormat(endDate)}`,
        }

        updateExperience(newExperience, index)
    }

    const handlePresentCheckboxChange = (e) => {
        setIsPresent(e.target.checked)

        const newExperience = {
            company,
            title,
            date: `${flipDateFormat(startDate)} - ${!isPresent ? 'Present' : flipDateFormat(endDate)}`,
        }

        updateExperience(newExperience, index)
    }

    return (
        <>
            <div className="flex h-auto w-auto flex-col items-center justify-center gap-4 overflow-y-hidden rounded-lg bg-white bg-opacity-20 p-10 shadow-lg backdrop-blur-xl backdrop-filter">
                <button
                    className="self-start"
                    onClick={() => removeExperience(index)}
                >
                    <X
                        size={20}
                        className="-translate-x-5 text-pipelines-gray-100"
                    />
                </button>
                <div className="flex flex-col items-center justify-center gap-3">
                    <label className="text-light text-pipelines-gray-100">
                        Company
                    </label>
                    <ExperienceQuerySearchInput
                        value={company}
                        handleSearch={handleCompanyChange}
                    />
                </div>

                <div className="flex flex-col items-center justify-center gap-3">
                    <label className="text-light text-pipelines-gray-100">
                        Title
                    </label>
                    <TitleQuerySearchInput
                        value={title}
                        handleSearch={handleTitleChange}
                    />
                </div>

                <div className="flex flex-col items-center justify-center gap-3">
                    <label className="text-light text-pipelines-gray-100">
                        Date
                    </label>
                    <div className="flex flex-col items-center justify-center gap-4">
                        <input
                            className="rounded-full bg-gray-100/60 px-4 py-2 text-gray-800 outline-none"
                            placeholder="September 2020 - September 2021"
                            value={startDate}
                            type="month"
                            pattern="\d{4}-\d{2}"
                            onChange={(e) =>
                                handleExperienceChange(e, 'startDate')
                            }
                        />

                        {!isPresent ? (
                            <input
                                className="rounded-full bg-gray-100/60 px-4 py-2 text-gray-800 outline-none"
                                placeholder="September 2020 - September 2021"
                                value={endDate}
                                type="month"
                                pattern="\d{4}-\d{2}"
                                onChange={(e) =>
                                    handleExperienceChange(e, 'endDate')
                                }
                            />
                        ) : (
                            <div></div>
                        )}
                        <div className="flex flex-col md:flex-row">
                            <label className="text-light ml-2 pr-2 text-pipelines-gray-100">
                                Present
                            </label>
                            <input
                                type="checkbox"
                                checked={isPresent}
                                onChange={handlePresentCheckboxChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

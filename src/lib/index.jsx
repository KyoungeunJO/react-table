import React from 'react';
import { useState } from 'react'
import './index.css'

function Table({headers, data}) {

    const [page, setPage] = useState(1)
    const [elements, setElements] = useState(data || [])
    const [nbToShow, setNbToShow] = useState(10)

    const NbPages = Math.ceil(data?.length / nbToShow)
    let nbOfRows = 0

    const sortRows = (index, event) => {
        const target = event.target
        const currentClass = target.classList[0]
        if (currentClass == 'sorting') {
            target.classList.remove('sorting')
            target.classList.add('sorting-asc')
            sortElements('asc', index)
        } else if (currentClass == 'sorting-asc') {
            target.classList.remove('sorting-asc')
            target.classList.add('sorting-desc')
            sortElements('desc', index)
        } else if (currentClass == 'sorting-desc') {
            target.classList.remove('sorting-desc')
            target.classList.add('sorting-asc')
            sortElements('asc', index)
        }
    }

    const sortElements = (direction, index) => {
        if (elements.length == 0) { return }

        const props = Object.keys(elements[0])
        const prop = props[index]
        let newElements

        if (direction == 'asc') {
            newElements = elements.sort((a, b) => a[prop] > b[prop] ? 1 : -1)
        }

        if (direction == 'desc') {
            newElements = elements.sort((a, b) => a[prop] < b[prop] ? 1 : -1)
        }

        setElements([...newElements])
    }

    const columnHeaders = headers.map((head, index) => {
        return <th key={`h-${index}`} className='sorting' onClick={(event) => sortRows(index, event)}>
                    {head}
                </th>
    })

    const sliceElements = (els) => {
        if (els.length == 0) { return els }

        const start = (page-1) * nbToShow
        const end = start + nbToShow
        return els.slice(start, end)
    }

    const rows = (() => {
        const elementsToDisplay = sliceElements(elements)
        if (elementsToDisplay?.length == 0) {
            return <tr><td className='row-empty' colSpan={headers.length}>No matching records found</td></tr>
        }

        return elementsToDisplay?.map((el, index) => {
            nbOfRows += 1
            return (
                <tr key={`row-${index}`} role="row" className={index % 2 == 0 ? 'even' : 'odd'}>
                    { Object.entries(el).map((val, index2) => {
                        return <td key={`cell-${index}-${index2}`}>{val[1]}</td>
                    }) }
                </tr>
            ) 
        })
    })()

    const handleSearch = (event) => {
        const text = event.target.value
        const newElements = data.filter(el => {
            let properties = []
            for (const [key, val] of Object.entries(el)) {
                properties.push(val)
            }
            const stringProp = properties.join(' ')
            return stringProp.includes(text)
        })
        setElements(newElements)
    }

    const selectChange = (event) => {
        const entriesToShow = parseInt(event.target.value)
        setNbToShow(entriesToShow)
    }

    const displayPages = () => {
        let pages = []
        for (let i=1; i <= NbPages; i++) {
            pages.push(
                <span key={`page-${i}`} onClick={() => moveToPage(i)} className={page == i ? 'page-active' : ''}>{i}</span>
            )
        }
        return pages
    }

    const movePage = (n) => {
        let toPage = page + n

        if (toPage < 1) { 
            toPage = 1 
        } else if (toPage > NbPages) {
            toPage = NbPages
        }
        setPage(toPage)
    }
    const moveToPage = (n) => setPage(n)

    return (
        <div className='full-width'>
            <div className="flex-spaced">
                <label>
                    Show
                    <select name="table-length" onChange={selectChange}>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </label>

                <div>
                    <label htmlFor="search">Search</label>
                    <input id="search" type="text" aria-label="Search" onChange={handleSearch} />
                </div>
            </div>

            <table aria-describedby="table_info">
                <thead className='head-table'>
                    <tr role="row">
                        {columnHeaders}
                    </tr>
                </thead>

                <tbody>
                    {rows}
                </tbody>
            </table>

            <div className='flex-spaced'>
                <p>Showing {nbOfRows} of {elements.length} entries</p>
                <div className='nb-page'>
                    {displayPages()}
                </div>
                <div className='buttons-page'>
                    <button className={`button-page btn-prev ${page == 1 ? 'btn-disabled' : ''}`} onClick={() => movePage(-1)}>Previous</button>
                    <button className={`button-page btn-next ${page == NbPages ? 'btn-disabled' : ''}`} onClick={() => movePage(1)}>Next</button>
                </div>
            </div>

        </div>
    )
}

export default Table
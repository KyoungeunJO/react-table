import React from 'react'
import Table from './lib'

const headers = [
    "First Name",
    "Last Name",
    "Start Date",
    "Department",
    "Date of Birth",
    "Street",
    "City",
    "State",
    "Zip Code",
]

const App = () => {
  return (
    <Table headers={headers} />
  )
}

export default App
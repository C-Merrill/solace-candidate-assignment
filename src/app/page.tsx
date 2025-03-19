"use client";

import { Advocate, specialties, Specialty } from "@/db/schema";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [specialtyFilters, setSpecialtyFilters] = useState<Specialty[]>([])

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const formatPhone = (phoneNumber: number): string => {
    const phoneNumberStr = phoneNumber.toString();
    return `+1 (${phoneNumberStr.slice(0,3)}) ${phoneNumberStr.slice(3,6)}-${phoneNumberStr.slice(6)}`
  }

  const filteredAdvocates = (() => {
    console.log("filtering advocates...");
    const term = searchTerm.toLowerCase();
    return advocates.filter((advocate) => {
      if (!(
        advocate.firstName.toLowerCase().includes(term) ||
        advocate.lastName.toLowerCase().includes(term) ||
        advocate.city.toLowerCase().includes(term) ||
        advocate.degree.toLowerCase().includes(term) ||
        advocate.yearsOfExperience.toString().includes(term)
      )) {
        return false;
      }
      if (!specialtyFilters.every(sf => !sf || advocate.specialties.includes(sf))) {
        return false;
      }
      return true;
    });
  })()


  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div className="space-y-4">
        <TextField placeholder="Search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <Autocomplete multiple options={specialties} renderInput={params => <TextField {...params} label="Specialties" />} value={specialtyFilters} onChange={(e, newValue) => {setSpecialtyFilters(newValue ?? [])}}></Autocomplete>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr className="bg-gray-200 space-x-4">
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate, index) => {
            return (
              <tr className={index % 2 > 0 ? 'bg-gray-100': 'white'} key={advocate.id.toString()}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s) => (
                    <div key={`${advocate.id}_${s}`}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{formatPhone(advocate.phoneNumber)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}

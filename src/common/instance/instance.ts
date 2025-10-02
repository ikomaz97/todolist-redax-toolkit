import axios from "axios"

const token = "cbb13dd0-42a7-409e-b222-cec62547608b"
const apiKey = "8f8b8a12-f302-419e-8f3b-a77e020bdfc5"

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1",
  headers: {
    Authorization: `Bearer ${token}`,
    "API-KEY": apiKey,
  },
})

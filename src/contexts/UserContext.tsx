import React, { createContext } from 'react'
import { userType } from '../constants/EntityType'

export const UserContext = createContext<userType | null>(null)
import {fetchCat, fetchDog} from '@/api/animalApi'
import {useState, useEffect} from 'react'


const useFetchDog = () => {

  const [dog, setDog] = useState<string>()

  const initFetchDog = async () => {
    
    const response = await fetchDog()
    setDog(response.data.message)
  }


  return {
    dog, initFetchDog
  }
}

const useFetchCat = () => {

  const [cat, setCat] = useState<string>()

  const initFetchCat = async () => {
    const response = await fetchCat();

    setCat(response.data?.[0].url)
  }

  return {
    cat, initFetchCat
  }
}
import { fetchDog} from '@/api/animalApi'
import {withAsync} from '@/helpers/withAsync'
import {useState, useEffect} from 'react'


type ApiStatus = 'IDDLE' | 'PENDING' | 'SUCCESS' | 'ERROR'


const useFetchDog = () => {

  const [dog, setDog] = useState<string>()
  const [fetchDogStatus, setFetchDogStatus] = useState<ApiStatus>('IDDLE')

  
  
const initFetchDog = async () => {
    
    
      setFetchDogStatus('PENDING')
       const { response, error } = await withAsync(() => fetchDog()) 
       if(error){
          setFetchDogStatus('ERROR')

       }else if(response){
         setDog(response.data.message)
         setFetchDogStatus('SUCCESS')
    
       }
     
   
  }


  return {
    dog, 
    initFetchDog,
    fetchDogStatus
  }
}

// const useFetchCat = () => {

//   const [cat, setCat] = useState<string>()

//   const initFetchCat = async () => {
//     const response = await fetchCat();

//     setCat(response.data?.[0].url)
//   }

//   return {
//     cat, initFetchCat
//   }
// }

// const useFetchAnimals = () => {
  
//   const {dog, initFetchDog} = useFetchDog()
//   // const {cat, initFetchCat} = useFetchCat()


//   const fetchAnimals = () => {
//     initFetchDog()
//     // initFetchCat()
//   }

//   useEffect(() => {
//     fetchAnimals()
//   }, [])


//   return {dog, fetchAnimals}
// }


function AnimalExample() {

  const { dog, fetchDogStatus, initFetchDog } = useFetchDog()

  useEffect(() => {
    initFetchDog()
  }, [])
  
  return (
    <>
      <div className='my-8 mx-auto max-w-2xl'>
        <div className='flex justify-center gap-8'>
        

          {fetchDogStatus === 'IDDLE' ? <p>Welcome</p> : null}
          {fetchDogStatus === 'PENDING' ? <p>Fetching Data</p> : null}
          {fetchDogStatus === 'ERROR' ? <p>Something went wrong</p> : null}
          {fetchDogStatus === 'SUCCESS' ? 
            (<img className="h-64 w-full object-cover" src={dog} alt="Dog"/>): null
          }
        </div>

        <button onClick={initFetchDog} className='mt-4 bg-blue-800 text-blue-100 p-4'>
          Fetch Animals
        </button>
      </div>
    </>
  )
}

export default AnimalExample
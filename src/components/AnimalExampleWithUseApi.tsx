import { fetchDog } from '@/api/animalApi'
// import { withAsync } from '@/helpers/withAsync'
import {  useEffect } from 'react'
import LoadingSpinner from './common/LoadingSpinner'
import {useApi} from '@/hooks/useApi'



const useFetchDog = () => {
  // const [dog, setDog] = useState<string>()

  // const [fetchDogStatus, setFetchDogStatus] = useState<ApiStatus>(IDLE)
  const {
    data: dog,
    setData: setDog,
    exec: initFetchDog,
    status: fetchDogStatus,
    setStatus: setFetchDogStatus,
    isIdle: isFetchDogStatusIdle,
    isPending: isFetchDogStatusPending,
    isError: isFetchDogStatusError,
    isSuccess: isFetchDogStatusSuccess,
  } = useApi(()=> fetchDog().then((response) => response.data.message))

  // const initFetchDog = async () => {
  //   setFetchDogStatus(PENDING)
  //   const { response, error } = await withAsync(() => fetchDog())
  //   if (error) {
  //     setFetchDogStatus(ERROR)
  //   } else if (response) {
  //     setDog(response.data.message)
  //     setFetchDogStatus(SUCCESS)
  //   }
  // }

  return {
    dog,
    initFetchDog,
    fetchDogStatus,
    isFetchDogStatusSuccess,
    isFetchDogStatusError,
    isFetchDogStatusPending,
    isFetchDogStatusIdle,
  }
}

function AnimalExampleWithUseApi() {
  const {
    dog,
    // fetchDogStatus,
    initFetchDog,
    isFetchDogStatusIdle,
    isFetchDogStatusPending,
    isFetchDogStatusError,
    isFetchDogStatusSuccess,
  } = useFetchDog()

  useEffect(() => {
    initFetchDog()
  }, [])

  return (
    <>
      <div className='my-8 mx-auto max-w-2xl'>
        <div className='flex justify-center gap-8'>
          {isFetchDogStatusIdle ? <p>Welcome</p> : null}
          {<LoadingSpinner show={isFetchDogStatusPending} delay={400} />}
          {/* { ? <p>Fetching Data</p> : null} */}
          {isFetchDogStatusError ? <p>Something went wrong</p> : null}
          {isFetchDogStatusSuccess ? (
            <img className='h-64 w-full object-cover' src={dog} alt='Dog' />
          ) : null}
        </div>

        <button
          onClick={initFetchDog}
          className='mt-4 bg-blue-800 text-blue-100 p-4'
        >
          Fetch Animals
        </button>
      </div>
    </>
  )
}

export default AnimalExampleWithUseApi

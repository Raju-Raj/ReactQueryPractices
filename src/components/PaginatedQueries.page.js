import React,{useState} from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

const fetchColors = (pageNumber) => {
    return axios.get(`http://localhost:4000/colors?_limit=2&_page=${pageNumber}`)
}

const PaginatedQueries = () => {
    const [pageNumber,setPageNumber] = useState(2)
    const {isLoading,isError,error,data,isFetching} = useQuery(['colors',pageNumber],()=>fetchColors(pageNumber),{
        keepPreviousData:true
    })
    console.log(pageNumber)
    if(isLoading){
        return <h2>Loading ..</h2>
    }

    if(isError){
        return <h2>{error.message}</h2>
    }
  return (
    <div>
        {isFetching && 'Loading..'}
        {
            data?.data.map((color)=>{
                return(
                    <div key={color.id}>
                        <h2>
                            {color.id} - {color.label}
                        </h2>
                    </div>
                )
            })
        }
        <div>
            <button onClick={() => setPageNumber((page)=>page-1)} disabled={pageNumber === 1}>Prev</button>
            <button onClick={() => setPageNumber((page) => page+1)} disabled={pageNumber === 4}>Next</button>
        </div>
    </div>
  )
}

export default PaginatedQueries
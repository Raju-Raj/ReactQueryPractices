import { useQuery,useMutation,useQueryClient } from "react-query"
// import axios from "axios"
import { request } from "../utils/axios-utils"

const fetchSuperHeros = () => {
    // return axios.get("http://localhost:4000/superheroes")
    return request({url:'/superheroes'})
}

const addSuperHero = (hero) => {
    // return axios.post('http://localhost:4000/superheroes',hero)
    return request({url:'/superheroes',method:'post',data:hero})
}

export const useSuperHeroesData = (onSuccess,onError) => {
    return useQuery('super-heroes',fetchSuperHeros,
    {
        // cacheTime:5000,
        // staleTime:0,
        // refetchOnMount:true,
        // refetchOnWindowFocus:"always"

        // refetchInterval:2000,
        // refetchIntervalInBackground:true,
        // enabled:false,

        onError,
        onSuccess,
        // select:(data)=>{
        //     const superHeroNames = data.data.map((hero)=>hero.name)
        //     return superHeroNames
        // }
    }
    )
}


export const useAddSuperHeroData = () => {
    const queryClient = useQueryClient()
    return useMutation(addSuperHero,{
        // onSuccess:(data) => {
        //     // queryClient.invalidateQueries('super-heroes')
            // queryClient.setQueriesData('super-heroes',(oldQueryData) => {
            //     return {
            //         ...oldQueryData,
            //         data:[...oldQueryData.data,data.data],
            //     }
            // })
        // }
        onMutate: async (newHero)=>{
            await queryClient.cancelQueries('super-heroes')
            const previousHeroData =queryClient.getQueryData('super-heroes')
            queryClient.setQueriesData('super-heroes',(oldQueryData) => {
                return {
                    ...oldQueryData,
                    data:[...oldQueryData.data,{
                        id: oldQueryData?.data?.length + 1, ...newHero
                    }],
                }
            })
            return {
                previousHeroData,
            }
        },
        onError:(_error,_hero,context)=>{
            queryClient.setQueryData('super-heroes',context.previousHeroData)
        },
        onSettled:()=>{
            queryClient.invalidateQueries('super-heroes')
        }
    })
}
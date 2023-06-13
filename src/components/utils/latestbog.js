import {readable} from 'svelte/store'

export const latestPostDetail = readable({
    title:'10+ AWS services explained',
    description:'Amazon Web Services(AWS) is a cloud computing platform with a humongous shelve of featured services that provide businesses, customers, startups and developers with access to cloud infrastructures and software. AWS includes the mixture o...',
    link:'https://www.abdulmumin.com/10-aws-services-explained'
})

export const others = readable([
    {title:'How to write Clean Code',
    link:'https://www.abdulmumin.com/how-to-write-clean-code'},
    {title:'Python best practices',
    link:'https://www.abdulmumin.com/python-best-practices'}
])
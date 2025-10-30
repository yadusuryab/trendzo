import React from 'react'
import logo from '@/public/wordmark.png'
import Image from 'next/image'


function Brand() {
  return (
    <Image src={logo.src} width={70} height={20} alt={process.env.NEXT_PUBLIC_APP_NAME || 'SHOPIGO'} />

  )
}

export default Brand

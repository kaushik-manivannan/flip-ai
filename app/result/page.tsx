'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Box, CircularProgress, Container, Typography } from "@mui/material";

const ResultPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const session_id: any = searchParams.get('session_id');

    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if (!session_id) return

            try {
                const res = await fetch(`api/checkout_sessions?session_id=${session_id}`)
                const sessionData = await res.json()

                if(res.ok) {
                    setSession(sessionData)
                } else {
                    setError(sessionData.error)
                }
            } catch (err){
                setError("An error occured");
            } finally {
                setLoading(false)
            }
        }
        fetchCheckoutSession()
    }, [session_id])

    if(loading){
        return (
            <Container sx={{mt: 4, textAlign: 'center'}}>      
                <CircularProgress />
                <Typography variant='h6'>Loading...</Typography>
            </Container>
        )
    }
    if (error){
        return(
        <Container sx={{mt: 4, textAlign: 'center'}}>      
            <Typography variant='h6'>{error}</Typography>
        </Container>
        )
    }

    return(
      <Container sx={{mt: 4, textAlign: 'center'}}>      
          {session.payment_status === 'paid' ? (
              <>
              <Typography variant="h4">Thank you for purchasing</Typography>
              <Box sx={{mt:22}}>
                  <Typography variant='h6'>{session_id}</Typography>
                  <Typography variant='body1'>
                      We have received your payment. You will receive an email with the order details shortly
                  </Typography>
              </Box>
              </>
          ):(
              <>
              <Typography variant="h4">Payment Failed</Typography>
                  <Box sx={{mt:22}}>
                      <Typography variant='h6'>{session_id}</Typography>
                      <Typography variant='body1'>
                          Your payment was not successful. Please try again
                      </Typography>
                  </Box>
              </>
          )}
      </Container>
  )
}

export default ResultPage;
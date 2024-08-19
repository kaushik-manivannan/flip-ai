'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import NavBar from "@/components/NavBar";

const ResultPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const session_id: string | null = searchParams.get('session_id');

    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if (!session_id) {
                setError("No session ID provided");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/webhook/stripe?session_id=${session_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const sessionData = await res.json();

                if (sessionData.error) {
                    throw new Error(sessionData.error);
                }

                setSession(sessionData);
            } catch (err) {
                console.error("Error fetching checkout session:", err);
                setError(err instanceof Error ? err.message : "An error occurred while fetching the session");
            } finally {
                setLoading(false);
            }
        };

        fetchCheckoutSession();
    }, [session_id]);

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

    return (
        <div className="h-screen">
        <NavBar showMainNav={false}/>
        <div className="flex flex-col items-center justify-center h-[90vh]">
            <div className="text-center">
                {session?.payment_status === 'paid' ? (
                    <>
                        <h1 className="text-4xl font-bold mb-6 text-primary">Thank you for purchasing!</h1>
                        <div className="mt-8">
                            <p className="text-lg text-center font-semibold mb-2">Order ID: {session_id}</p>
                            <p className="text-gray-600 dark:text-gray-300">
                                We have received your payment.
                            </p>
                        </div>
                        <button 
                            onClick={() => router.push('/create')}
                            className="mt-8 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
                        >
                            Start Creating Flashcards
                        </button>
                    </>
                ) : (
                    <>
                        <h1 className="text-4xl font-bold mb-6 text-red-600">Payment Failed</h1>
                        <div className="mt-8">
                            <p className="text-lg font-semibold mb-2">Session ID: {session_id}</p>
                            <p className="text-gray-600 dark:text-gray-300">
                                Your payment was not successful. Please try again or contact support if the issue persists.
                            </p>
                        </div>
                        <button 
                            onClick={() => router.push('/pricing')}
                            className="mt-8 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </>
                )}
            </div>
        </div>
        </div>
    );
}

export default ResultPage;
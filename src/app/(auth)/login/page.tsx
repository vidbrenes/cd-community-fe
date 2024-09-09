'use client'
import { FormEvent, useState } from 'react';
import { SimpleWidget } from '@/components';
// import { Container } from 'postcss';
import { Box, Button, Container, FormControl, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

// export const metadata = {
//   title: 'Admin Dashboard',
//   description: 'Admin Dashboard'
// }

export default function SignInPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending(true)

    try {
      const response = await signIn('credentials', {
        redirect: false,
        username,
        password,
      })

      if (response?.error) {
        console.log('Error', response.error)
        setErrorMessage(response.error)
        setPending(false)
        return
      }

      setPending(false)
      router.push('/dashboard/main')

    } catch (error) {
      console.error('Something went wrong', error)
      setErrorMessage('Something went wrong')
      setPending(false)
    }
  }

  return (
    <Container sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '400px',
          height: '400px',
          borderRadius: '10px',
          padding: '20px',
        }}>
          <Typography sx={{ marginBottom: '20px' }} variant='h4'>Sign in</Typography>
          <TextField
            sx={{ marginBottom: '10px' }}
            label="username"
            placeholder="username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            sx={{ marginBottom: '10px' }}
            label="password"
            placeholder="********"
            variant="outlined"
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMessage && <Typography sx={{ color: 'red' }}>{errorMessage}</Typography>}
          <Button variant="contained" type='submit'>Submit</Button>
        </Box>
      </form>
    </Container>
  )
}
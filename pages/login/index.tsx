// External imports
import { useState } from 'react';
import { Text, Box, Button, Flex, FormControl, FormLabel, FormErrorMessage, Heading, Input, SimpleGrid } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';

// Local imports
import useSnackbar from '../../hooks/useSnackbar';
import { URL } from '../../utils/links';
import { getCsrfToken, getProviders, getSession, signIn } from 'next-auth/react';
import { Provider } from 'next-auth/providers';
import Modal from '../../components/Modal';

type Props = {
  csrfToken: string;
  providers: Provider[];
};

type FormData = {
  email: string;
};

const LoginPage = ({ csrfToken, providers }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' });
  const router = useRouter();

  const [isPendingLogin, setPendingLogin] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>(null);
  const { openErrorNotification, openSuccessNotification } = useSnackbar();

  const login = (data: FormData) => {
    let newTimeout = setTimeout(() => {
      setPendingLogin(false);
      setTimeoutId(null);
      return Promise.reject('new Error Request timed out, try inputting email again');
    }, 100000);
    setTimeoutId(newTimeout);
    return signIn('email', { email: data.email, redirect: false });
  };

  const mutation = useMutation(login, {
    onSuccess: data => {
      console.log(data);
      openSuccessNotification('Login successful', 'Welcome back!');
      router.push('/');
    },
    onSettled: () => {},
    onError: error => {
      openErrorNotification('Login failed', 'Please check your email and try again.');
    },
  });

  const onSubmit = (data: FormData) => {
    setPendingLogin(true);
    mutation.mutate(data);
  };

  const handleModalClosed = () => {
    clearTimeout(timeoutId);
    setPendingLogin(false);
  };

  return (
    <Box height='100vh' display='flex' justifyContent='center' alignItems='center' backgroundColor='#f6f6f6'>
      <Flex width='full' alignContent='center' justifyContent='center' height='100%'>
        <Box
          marginBlock={[2, 0, 0, 0]}
          boxShadow='none'
          display='flex'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          width='full'
        >
          <>
            <Heading color='black' fontWeight={700} className={'text-[2.25rem]'}>
              Log In
            </Heading>
            <Box textAlign='left'>
              <form onSubmit={handleSubmit(onSubmit)} color='black'>
                <FormControl isInvalid={Boolean(errors.email)} mt={4} width={{ sm: '80vw', md: '80vw', lg: '500px' }}>
                  <FormLabel htmlFor='email' color='#3D3D3D'>
                    Email
                  </FormLabel>
                  <Flex>
                    <Input
                      id='email'
                      type='email'
                      placeholder='Enter your email address'
                      borderColor='grey'
                      color='#3D3D3D'
                      {...register('email', {
                        required: 'This is required.',
                        pattern: {
                          value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                          message: 'Please enter a valid email address.',
                        },
                      })}
                    />
                  </Flex>
                  {errors.email && <FormErrorMessage>Please enter a valid email address.</FormErrorMessage>}
                </FormControl>
                <Button type='submit' backgroundColor='#8EC12C' _dark={{ backgroundColor: '#78be20' }} color='black' mt={4} width='full'>
                  Log In
                </Button>
                <Box width='full' textAlign='center' mt={5}>
                  Don&#39;t have an account?{' '}
                  <Text as='b'>
                    <Text as='u'>
                      <Link href='/signup'>Sign Up</Link>
                    </Text>
                  </Text>
                </Box>
              </form>
              <Flex color={'#9E9E9E'}>
                <div className={'border-[#9E9E9E]-[0.4] mt-5 h-0 w-1/2 border-[0.1px] border-solid'} />
                <span className={'m-2'}>OR</span>
                <div className={'border-[#9E9E9E]-[0.4] mt-5 h-0 w-1/2 border-[0.1px] border-solid'} />
              </Flex>

              <Box width='full' textAlign='center' mt={5} mb={5}>
                <Text as='b'>Login with SSO</Text>
              </Box>

              <Flex justifyContent={'space-evenly'}>
                {Object.values(providers).map(provider =>
                  provider.id === 'email' ? (
                    <></>
                  ) : (
                    <div className='m-7 cursor-pointer' key={provider.name}>
                      <Image
                        src={`/assets/${provider.name}Login.svg`}
                        width='45'
                        height='45'
                        alt='user'
                        onClick={event => {
                          event.preventDefault();
                          signIn(provider.id);
                        }}
                      />
                    </div>
                  ),
                )}
              </Flex>
            </Box>
          </>
        </Box>
      </Flex>
      <Modal title='Pending Email' onClose={handleModalClosed} isOpen={isPendingLogin}>
        <div>
          <h1>Check your email</h1>
          <p>A sign in link has been sent to your email address.</p>
        </div>
      </Modal>
    </Box>
  );
};

export default LoginPage;

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });
  if (session) {
    return { redirect: { destination: '/' } };
  }
  const csrfToken = await getCsrfToken(context);
  const providers = await getProviders();
  return {
    props: { csrfToken, providers },
  };
}

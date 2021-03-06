/* eslint-disable no-unused-expressions */
import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { AuthContext } from '../../contexts/AuthContext';
import { api } from '../../service/api';
import {
  Container,
  Logo,
  StyledButton,
  StyledForm,
  StyledInput,
  Top,
} from './styles';

interface IInputProps {
  firt_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  birthdate: string;

  addressName?: string;
  cep?: string;
  street?: string;
  number?: string;
  city?: string;
  district?: string;
  state?: string;
  province?: string;
}

const Register: NextPage = () => {
  const { handleSubmit, register } = useForm();
  const [showAddress, setShowAddress] = useState(false);
  const { signIn } = useContext(AuthContext);

  const onSubmit: SubmitHandler<IInputProps> = async (data: any) => {
    const createUser = await api.post('/users/create', {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      password_confirmed: data.password,
      phone: data.phone,
      address: {
        name: data.addressName,
        cep: data.cep,
        street: data.street,
        number: data.number,
        city: data.city,
        district: data.district,
        state: data.state,
        province: data.province
      }

    });

    if (createUser.status === 201) {
      signIn(createUser.data);
    }
  };

  const handleAddress = () => {
    showAddress === true ? setShowAddress(false) : setShowAddress(true);
  };

  return (
    <Container>
      <Top>
        <Logo>
          <Link href="/">
            <a>
              <Image src="/app.svg" width={100} height={100} />
            </a>
          </Link>
        </Logo>

        <StyledForm
          onSubmit={handleSubmit((data: any) => {
            onSubmit(data);
          })}
        >
          <StyledInput
            type="text"
            label="Nome"
            register={register}
            name="first_name"
            isRequired={true}
          ></StyledInput>

          <StyledInput
            type="text"
            label="Sobrenome"
            register={register}
            name="last_name"
            isRequired={true}
          ></StyledInput>

          <StyledInput
            type="text"
            label="Telefone"
            register={register}
            name="phone"
            isRequired={true}
          ></StyledInput>

          <StyledInput
            type="email"
            label="E-mail"
            register={register}
            name="email"
            isRequired={true}
          ></StyledInput>

          {/* <StyledInput
            type="text"
            label="Data de nascimento"
            register={register}
            name="birthdate"
            isRequired={true}
          ></StyledInput> */}

          <StyledInput
            type="password"
            label="Senha"
            register={register}
            name="password"
            isRequired={true}
          ></StyledInput>

          <StyledInput
            type="password"
            label="Confirmar senha"
            register={register}
            name="password_confirmed"
            isRequired={true}
          ></StyledInput>

          {showAddress !== true && (
            <span onClick={() => handleAddress()}>+ Adicionar endere??o</span>
          )}

          {showAddress === true && (
            <>
              <StyledInput
                type="text"
                label="Apelido endere??o"
                register={register}
                name="addressName"
                isRequired={true}
              ></StyledInput>

              <StyledInput
                type="text"
                label="Cep"
                register={register}
                name="cep"
                isRequired={true}
              ></StyledInput>

              <StyledInput
                type="text"
                label="Rua"
                register={register}
                name="street"
                isRequired={true}
              ></StyledInput>

              <StyledInput
                type="text"
                label="N??mero"
                register={register}
                name="number"
                isRequired={true}
              ></StyledInput>

              <StyledInput
                type="text"
                label="Bairro"
                register={register}
                name="district"
                isRequired={true}
              ></StyledInput>

              <StyledInput
                type="text"
                label="Cidade"
                register={register}
                name="city"
                isRequired={true}
              ></StyledInput>

              <StyledInput
                type="text"
                label="Estado"
                register={register}
                name="state"
                isRequired={true}
              ></StyledInput>

              <StyledInput
                type="text"
                label="Pa??s"
                register={register}
                name="province"
                isRequired={true}
              ></StyledInput>

              <span onClick={() => handleAddress()}>- Remover endere??o</span>
            </>
          )}

          <StyledButton type="submit"> Enviar </StyledButton>
        </StyledForm>
      </Top>

      <span>
        Voc??? j?? possui uma conta?
        <Link href="/login">
          <a>
            <strong> Fa??a o login</strong>
          </a>
        </Link>
      </span>
    </Container>
  );
};

export default Register;

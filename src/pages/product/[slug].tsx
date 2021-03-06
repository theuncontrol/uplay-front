/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */

import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { FiCreditCard, FiHeart, FiShare2, FiTruck } from 'react-icons/fi';

import { getStringPrice } from '../../common/getStringPrice';
import { Carousel } from '../../Components/Carousel';
import { RoundedButton } from '../../Components/Header/styles';
import { AuthContext } from '../../contexts/AuthContext';
import { api } from '../../service/api';
import {
  Container,
  ProductImage,
  ProductInfo,
  StyledSelect,
  ProductCheckout,
  StyledButton,
  ProductDescription,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Box,
} from './styles';

export type Address = {
  street: string;
  city: string;
  state: string;
  province: string;
  number: string;
  complement: string;
  name?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  avatar: string;
  status: string;
  created_at: string;
  updated_at: string;
  profileId: string;
  address: Address[];
  ordersId: any[];
};

type Comment = {
  id: string;
  userId: string;
  created_at: string;
  updated_at: string;
  productId: string;
  comment: string;
  user: User;
};

type IProductImages = {
  id: string;
  productId: string;
  image_name: string;
  image_url: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  warranty: string;
  color: string;
  reference: string;
  code: string;
  stock: string;
  brand: string;
  categoryId: string;
  comments: Comment[];
  product_image: IProductImages[];
};

type ProductsProps = {
  product: Product;
};

type Stock = {
  label: string;
  value: number;
  idx: number;
};

const customStyles = {
  option: (provided: any) => ({
    ...provided,
    fontWeight: 400,
    padding: 10,
  }),
  control: () => ({
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
  }),
  singleValue: (provided: any, state: any) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition };
  },
};
export default function Product({ product }: ProductsProps) {
  const [strPrice, setStrPrice] = useState('');

  useEffect(() => {
    setStrPrice(getStringPrice(product.price));
  }, []);

  const quota = (product.price / 10).toFixed(2).toString().replace('.', ',');

  const newStock: Array<Stock> = [];
  for (let index = 0; index < Number(product.stock); index++) {
    const lb = (index + 1).toString();
    const label = Number(lb) > 1 ? `${lb} unidades` : `${lb} unidade`;
    newStock.push({
      value: index + 1,
      label,
      idx: index,
    });
  }
  const [qnt, setQnt] = useState(newStock[0].value);

  const [dataProducts, setDataProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const { fillUserData, isAuthenticated } = useContext(AuthContext);
  useEffect(() => {
    const getAllProducts = async () => {
      const response = await api.get('/product/all', {
        params: {
          limit: 6,
        },
      });
      setAllProducts(response.data);
    };
    const getProductsByCategory = async () => {
      const response = await api.get(
        `/product/by_category/${product.categoryId}`,
        {
          params: {
            limit: 6,
          },
        }
      );
      setDataProducts(response.data);
    };
    getAllProducts();
    getProductsByCategory();
  }, []);

  const handleSendToCart = async (qtn: number, id: string, price: number) => {
    if (isAuthenticated === true) {
      await api.post('/product/addToCart', { productId: id, qtn, price });
      await fillUserData();
      Router.push('/cart');
    }
  };

  return (
    <Container>
      <ProductImage>
        <Carousel type="productimg" productImages={product.product_image} />
        {/* <Image
          src={`${product.product_image[0].image_url}`}
          width="100%"
          height="100%"
        /> */}
      </ProductImage>
      <div className="div">
        <ProductInfo>
          <div className="texts">
            <div className="info">
              <span>{product.name}</span>
              <span>R$ {strPrice}</span>
              <span style={{ color: 'green' }}>Em at?? 10x de R$ {quota}</span>
            </div>

            <div className="track">
              <span className="payments">Ver os meios de pagamento</span>

              <span className="send">
                <FiTruck />
                Frete gr??tis para todo brasil
              </span>
            </div>

            <div className="stock">
              <h4>
                {Number(product.stock) === 1
                  ? '??ltimo d??sponivel'
                  : Number(product.stock) > 1
                    ? 'Estoque d??sponivel'
                    : 'Sem estoque'}
              </h4>
              <div className="form">
                <span>Quantidade: </span>

                <StyledSelect
                  styles={customStyles}
                  defaultValue={newStock[0]}
                  options={newStock}
                  onChange={({ value }: any) => setQnt(value)}
                />

                <span>
                  {Number(product.stock) > 1
                    ? `(${Number(product.stock)} disponiveis)`
                    : `(${Number(product.stock)} disponivel)`}
                </span>
              </div>
            </div>
          </div>
          <div className="icons">
            <RoundedButton>
              <FiShare2 />
            </RoundedButton>
            <RoundedButton>
              <FiHeart />
            </RoundedButton>
          </div>
        </ProductInfo>

        <ProductCheckout>
          <StyledButton
            type={'button'}
            onClick={() => handleSendToCart(qnt, product.id, product.price)}
          >
            Enviar para o carrinho
          </StyledButton>
          {/* <StyledButton type={'button'}>Enviar para o carrinho</StyledButton> */}
        </ProductCheckout>
      </div>
      <div className="bottom">
        <div className="carousel">
          <span>Mais produtos que possam te interessar</span>
          {dataProducts.length > 0 && (
            <Carousel products={dataProducts} type="scroll" />
          )}
        </div>

        <ProductDescription>
          <div className="content">
            <div className="wrapper">
              <div className="box">
                <h4>Descri????o do produto</h4>
                <span>{product.description}</span>
              </div>
              <div className="box">
                <h4>Garantia</h4>
                <span>Garantia de {product.warranty}, direto na loja!</span>
              </div>
            </div>
            <div className="wrapper">
              <div className="box">
                <h4>Meios de pagamento</h4>
                <div className="payment">
                  <FiCreditCard /> Pague em at?? 10x no cart??o
                </div>
                <div className="icons">
                  <div className="icon">
                    <img src={'/master.png'} />
                  </div>
                  <div className="icon">
                    <img src={'/visa.svg'} />
                  </div>
                  <div className="icon">
                    <img src={'/elo.svg'} />
                  </div>
                  <div className="icon">
                    <img src={'/pix.png'} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="content">
            <div className="comment">
              <h4>Opini??es sobre o produto</h4>
              {product.comments.length > 0 ? (
                product.comments.map((comment) => (
                  <div key={comment.id} className="commentContent">
                    <div className="avatar">
                      <Avatar>
                        <AvatarImage
                          src={comment.user.avatar}
                          alt={comment.user.name}
                        />
                        <AvatarFallback delayMs={600}>
                          {comment?.user?.name
                            ?.match(/(\b\S)?/g)
                            ?.join('')
                            ?.match(/(^\S|\S$)?/g)
                            ?.join('')
                            ?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="commentInfo">
                      <h4>{comment.user?.name}</h4>
                      <span>{comment.comment}</span>
                    </div>
                  </div>
                ))
              ) : (
                <span>Nenhum coment??rio at?? o momento</span>
              )}
            </div>

            <div className="moreProducts">
              <h5>Mais produtos que voce possa gostar</h5>
              <div className="all">
                {allProducts.map((_product: Product) => (
                  <Link href={`/product/${_product.id}`} key={_product.id}>
                    <Box>
                      <div className="img">
                        <Image
                          src={`${_product?.product_image[0]?.image_url || '/'
                            }`}
                          width="100%"
                          height="100%"
                        />
                      </div>
                      <div className="texts">
                        <span>{_product.name}</span>
                        <span>R$ {_product.price}</span>
                      </div>
                    </Box>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </ProductDescription>
      </div>
    </Container>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('/product/all', {
    params: {
      _sort: 'created_at',
      _order: 'desc',
    },
  });

  const paths = data.map((product: any) => ({
    params: {
      slug: product.id,
    },
  }));
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug }: any = ctx.params;
  const { data } = await api.get(`/product/${slug}`);

  const product = {
    id: data.id,
    name: data.name,
    price: data.price,
    description: data.description,
    warranty: data.warranty,
    color: data.color,
    reference: data.reference,
    code: data.code,
    stock: data.stock,
    brand: data.brand,
    categoryId: data.categoryId,
    comments: data.comments,
    product_image:
      data.product_image?.length > 0
        ? data.product_image
        : [{ image_url: '/' }],
  };

  return {
    props: { product },
    revalidate: 60 * 60 * 24,
  };
};

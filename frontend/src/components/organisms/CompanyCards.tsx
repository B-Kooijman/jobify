import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Card from 'components/molecules/Card';
import { CardsProps } from 'src/types/types';

type CompanyCardsProps = CardsProps;

const CompanyCards = (props: CompanyCardsProps): JSX.Element => {
  const { datasource, item } = props.fields.data || {};
  return (
    <div>
      <Text field={datasource?.heading} />
      <div className="container">
        <div className="row">
          {item?.children?.results?.map((company) => {
            const { image, friendlyUrl } = company;
            return <Card {...company} image={image} url={friendlyUrl.value} key={company?.id} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default CompanyCards;

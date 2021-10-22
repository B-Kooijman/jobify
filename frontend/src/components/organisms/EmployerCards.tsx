import { Field, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { ImageFieldValue } from '@sitecore-jss/sitecore-jss-react/types/components/Image';
import Card from 'components/molecules/Card';

type EmployerCards = {
  fields: {
    data: {
      contextItem: {
        title: Field<string>;
        image: ImageFieldValue;
      };
      search: {
        results: [
          {
            id: string;
            friendlyUrl: Field<string>;
            title: Field<string>;
            text: Field<string>;
          }
        ];
      };
    };
  };
};

const EmployerCards = (props: EmployerCards): JSX.Element => {
  const { contextItem, search } = props.fields.data || {};
  console.log(props);
  return (
    <div>
      <Text field={contextItem?.title} />
      <div className="container">
        <div className="row">
          {search?.results?.map((vacancy) => {
            const { friendlyUrl } = vacancy;
            return (
              <Card
                {...vacancy}
                image={{ value: { src: contextItem.image?.src } }}
                // bottomLink={{
                //   value: {
                //     text: bottomTitle.value,
                //     href: friendlyUrl.value,
                //   },
                // }}
                url={friendlyUrl.value}
                key={vacancy?.id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmployerCards;

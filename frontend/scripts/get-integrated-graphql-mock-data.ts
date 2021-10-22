export function addMock(rendering: any) {
  if (!rendering.fields) {
    return;
  }

  switch (rendering.componentName) {
    case 'NavigationBar':
      return addNavigationBarMock(rendering);
    case 'VacancyCards':
      return addVacancyCardsMock(rendering);
    case 'CompanyCards':
      return addCompanyCardsMock(rendering);
    case 'EmployerCards':
      return addEmployerCardsMock(rendering);
    default:
      return;
  }
}

const addNavigationBarMock = (rendering: any) => {
  rendering.fields = {
    data: {
      datasource: {
        heading: {
          value: 'Jobify',
        },
      },
      menu: {
        children: {
          results: [
            {
              id: 'mock-123',
              url: {
                path: '/vacancies',
              },
              pageTitle: {
                value: 'vacancies',
              },
            },
            {
              id: 'mock-456',
              url: {
                path: '/companies',
              },
              pageTitle: {
                value: 'companies',
              },
            },
            {
              id: 'mock-780',
              url: {
                path: '/employers',
              },
              pageTitle: {
                value: 'employers',
              },
            },
          ],
        },
      },
    },
  };

  return rendering;
};

const addVacancyCardsMock = (rendering: any) => {
  rendering.fields = {
    data: {
      datasource: {
        heading: {
          value: 'Jobify',
        },
      },
      item: {
        children: {
          results: [
            {
              id: 'microsoft-1',
              friendlyUrl: {
                value: 'software-developer',
              },
              title: {
                value: 'software developer',
              },
              text: {
                value: 'We are looking for a software developer!',
              },
              relatedEmployer: {
                targetItem: {
                  id: 'CCB5F22CF1B94E0593000A01D573C782',
                  bottomTitle: {
                    value: 'Microsoft',
                  },
                  image: {
                    alt: 'microsoft',
                    src: 'data/media/img/jss_logo.png',
                  },
                  friendlyUrl: {
                    value: 'microsoft',
                  },
                },
              },
            },
            {
              id: 'apple-1',
              friendlyUrl: {
                value: 'frontend-developer',
              },
              title: {
                value: 'frontend developer',
              },
              text: {
                value: 'Frontend developer wanted!',
              },
              relatedEmployer: {
                targetItem: {
                  id: 'CCB5F22CF1B94E0593000A01D573C782',
                  bottomTitle: {
                    value: 'Apple',
                  },
                  image: {
                    alt: 'apple',
                    src: 'data/media/img/jss_logo.png',
                  },
                  friendlyUrl: {
                    value: 'apple',
                  },
                },
              },
            },
            {
              id: 'google-1',
              friendlyUrl: {
                value: 'product-owner',
              },
              title: {
                value: 'product owner',
              },
              text: {
                value: 'Are you our new Product Owner?',
              },
              relatedEmployer: {
                targetItem: {
                  id: 'CCB5F22CF1B94E0593000A01D573C782',
                  bottomTitle: {
                    value: 'Google',
                  },
                  image: {
                    alt: 'google',
                    src: 'data/media/img/jss_logo.png',
                  },
                  friendlyUrl: {
                    value: 'google',
                  },
                },
              },
            },
          ],
        },
      },
    },
  };

  return rendering;
};

const addCompanyCardsMock = (rendering: any) => {
  rendering.fields = {
    data: {
      datasource: {
        heading: {
          value: 'Jobify',
        },
      },
      item: {
        children: {
          results: [
            {
              id: 'microsoft',
              friendlyUrl: {
                value: 'microsoft',
              },
              title: {
                value: 'Microsoft',
              },
              text: {
                value: 'We have multiple open positions. Join us.',
              },
              image: {
                alt: 'microsoft',
                src: 'data/media/img/jss_logo.png',
              },
            },
            {
              id: 'apple',
              friendlyUrl: {
                value: 'apple',
              },
              title: {
                value: 'Apple',
              },
              text: {
                value: 'Always looking for talent.',
              },
              image: {
                alt: 'apple',
                src: 'data/media/img/jss_logo.png',
              },
            },
            {
              id: 'google',
              friendlyUrl: {
                value: 'google',
              },
              title: {
                value: 'Google',
              },
              text: {
                value: 'Fully remote positions available.',
              },
              image: {
                alt: 'google',
                src: 'data/media/img/jss_logo.png',
              },
            },
          ],
        },
      },
    },
  };

  return rendering;
};

const addEmployerCardsMock = (rendering: any) => {
  rendering.fields = {
    data: {
      contextItem: {
        title: {
          value: 'Jobify',
        },
        image: {
          alt: 'microsoft',
          src: 'data/media/img/jss_logo.png',
        },
      },
      search: {
        results: [
          {
            id: 'microsoft-1',
            friendlyUrl: {
              value: '/microsoft/software-developer',
            },
            title: {
              value: 'software developer',
            },
            text: {
              value: 'We are looking for a software developer!',
            },
          },
        ],
      },
    },
  };

  return rendering;
};

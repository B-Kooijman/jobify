export function addMock(rendering: any) {
  if (!rendering.fields) {
    return;
  }

  switch (rendering.componentName) {
    case 'NavigationBar':
      return addNavigationBarMock(rendering);
    case 'VacancyCards':
      return addVacancyCardsMock(rendering);
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
      vacancies: {
        children: {
          results: [
            {
              id: 'microsoft-1',
              url: {
                path: '/microsoft/software-developer',
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
                },
              },
            },
            {
              id: 'apple-1',
              url: {
                path: '/apple/frontend-developer',
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
                },
              },
            },
            {
              id: 'google-1',
              url: {
                path: 'google/product-owner',
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

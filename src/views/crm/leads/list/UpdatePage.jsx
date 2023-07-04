import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import SendIcon from '@mui/icons-material/Send';
import {
  Autocomplete,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Skeleton,
  TextField,
  Typography
} from '@mui/material';

// project imports
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateUser } from 'services/users.service';
import { useGetVilleCodePostals, useGetVilles } from 'services/zone-villes.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';
import AutoComplete from 'views/forms/components/AutoComplete';

const ClientCreatePage = () => {
  const { clientId } = useParams();

  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    default_pagination: '',
    email: '',
    fax: '',
    password: '',
    address: '',
    phone_number: '',
    identifient_fiscal: '',
    identifient_tva: '',
    interlocuteur_adresse: '',
    interlocuteur_fiscale: '',
    interlocuteur: '',
    code_postal: '',
    ville: '',
    role: 'client'
  });

  const createClientMutation = useCreateUser(clientId);

  const getVilleCodePostalsQuery = useGetVilleCodePostals({ villeId: formInput?.ville });
  const villeCodePostalsData = getVilleCodePostalsQuery.data;

  const getVillesQuery = useGetVilles();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    try {
      await createClientMutation.mutateAsync(formInput);

      navigate('/leads/list');
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 },
    {
      label: 'The Lord of the Rings: The Return of the King',
      year: 2003
    },
    { label: 'The Good, the Bad and the Ugly', year: 1966 },
    { label: 'Fight Club', year: 1999 },
    {
      label: 'The Lord of the Rings: The Fellowship of the Ring',
      year: 2001
    },
    {
      label: 'Star Wars: Episode V - The Empire Strikes Back',
      year: 1980
    },
    { label: 'Forrest Gump', year: 1994 },
    { label: 'Inception', year: 2010 },
    {
      label: 'The Lord of the Rings: The Two Towers',
      year: 2002
    },
    { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { label: 'Goodfellas', year: 1990 },
    { label: 'The Matrix', year: 1999 },
    { label: 'Seven Samurai', year: 1954 },
    {
      label: 'Star Wars: Episode IV - A New Hope',
      year: 1977
    },
    { label: 'City of God', year: 2002 },
    { label: 'Se7en', year: 1995 },
    { label: 'The Silence of the Lambs', year: 1991 },
    { label: "It's a Wonderful Life", year: 1946 },
    { label: 'Life Is Beautiful', year: 1997 },
    { label: 'The Usual Suspects', year: 1995 },
    { label: 'Léon: The Professional', year: 1994 },
    { label: 'Spirited Away', year: 2001 },
    { label: 'Saving Private Ryan', year: 1998 },
    { label: 'Once Upon a Time in the West', year: 1968 },
    { label: 'American History X', year: 1998 },
    { label: 'Interstellar', year: 2014 },
    { label: 'Casablanca', year: 1942 },
    { label: 'City Lights', year: 1931 },
    { label: 'Psycho', year: 1960 },
    { label: 'The Green Mile', year: 1999 },
    { label: 'The Intouchables', year: 2011 },
    { label: 'Modern Times', year: 1936 },
    { label: 'Raiders of the Lost Ark', year: 1981 },
    { label: 'Rear Window', year: 1954 },
    { label: 'The Pianist', year: 2002 },
    { label: 'The Departed', year: 2006 },
    { label: 'Terminator 2: Judgment Day', year: 1991 },
    { label: 'Back to the Future', year: 1985 },
    { label: 'Whiplash', year: 2014 },
    { label: 'Gladiator', year: 2000 },
    { label: 'Memento', year: 2000 },
    { label: 'The Prestige', year: 2006 },
    { label: 'The Lion King', year: 1994 },
    { label: 'Apocalypse Now', year: 1979 },
    { label: 'Alien', year: 1979 },
    { label: 'Sunset Boulevard', year: 1950 },
    {
      label: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
      year: 1964
    },
    { label: 'The Great Dictator', year: 1940 },
    { label: 'Cinema Paradiso', year: 1988 },
    { label: 'The Lives of Others', year: 2006 },
    { label: 'Grave of the Fireflies', year: 1988 },
    { label: 'Paths of Glory', year: 1957 },
    { label: 'Django Unchained', year: 2012 },
    { label: 'The Shining', year: 1980 },
    { label: 'WALL·E', year: 2008 },
    { label: 'American Beauty', year: 1999 },
    { label: 'The Dark Knight Rises', year: 2012 },
    { label: 'Princess Mononoke', year: 1997 },
    { label: 'Aliens', year: 1986 },
    { label: 'Oldboy', year: 2003 },
    { label: 'Once Upon a Time in America', year: 1984 },
    { label: 'Witness for the Prosecution', year: 1957 },
    { label: 'Das Boot', year: 1981 },
    { label: 'Citizen Kane', year: 1941 },
    { label: 'North by Northwest', year: 1959 },
    { label: 'Vertigo', year: 1958 },
    {
      label: 'Star Wars: Episode VI - Return of the Jedi',
      year: 1983
    },
    { label: 'Reservoir Dogs', year: 1992 },
    { label: 'Braveheart', year: 1995 },
    { label: 'M', year: 1931 },
    { label: 'Requiem for a Dream', year: 2000 },
    { label: 'Amélie', year: 2001 },
    { label: 'A Clockwork Orange', year: 1971 },
    { label: 'Like Stars on Earth', year: 2007 },
    { label: 'Taxi Driver', year: 1976 },
    { label: 'Lawrence of Arabia', year: 1962 },
    { label: 'Double Indemnity', year: 1944 },
    {
      label: 'Eternal Sunshine of the Spotless Mind',
      year: 2004
    },
    { label: 'Amadeus', year: 1984 },
    { label: 'To Kill a Mockingbird', year: 1962 },
    { label: 'Toy Story 3', year: 2010 },
    { label: 'Logan', year: 2017 },
    { label: 'Full Metal Jacket', year: 1987 },
    { label: 'Dangal', year: 2016 },
    { label: 'The Sting', year: 1973 },
    { label: '2001: A Space Odyssey', year: 1968 },
    { label: "Singin' in the Rain", year: 1952 },
    { label: 'Toy Story', year: 1995 },
    { label: 'Bicycle Thieves', year: 1948 },
    { label: 'The Kid', year: 1921 },
    { label: 'Inglourious Basterds', year: 2009 },
    { label: 'Snatch', year: 2000 },
    { label: '3 Idiots', year: 2009 },
    { label: 'Monty Python and the Holy Grail', year: 1975 }
  ];

  return (
    <MainCard title="Ajouter Leads" backButton goBackLink="/leads/list">
      <div>
        <>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  fullWidth
                  label="Nom Complet*"
                  value={formInput?.name || ''}
                  name="name"
                  onChange={handleChange}
                  error={!!formErrors?.data?.name}
                  helperText={renderArrayMultiline(formErrors?.data?.name)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  fullWidth
                  label="E-mail*"
                  value={formInput?.email || ''}
                  name="email"
                  onChange={handleChange}
                  error={!!formErrors?.data?.email}
                  helperText={renderArrayMultiline(formErrors?.data?.email)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  name="address"
                  onChange={handleChange}
                  fullWidth
                  label="Adresse*"
                  value={formInput?.address || ''}
                  error={!!formErrors?.data?.address}
                  helperText={renderArrayMultiline(formErrors?.data?.address)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  name="address"
                  onChange={handleChange}
                  fullWidth
                  label="Code Postale*"
                  value={formInput?.address || ''}
                  error={!!formErrors?.data?.address}
                  helperText={renderArrayMultiline(formErrors?.data?.address)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  name="phone_number"
                  onChange={handleChange}
                  fullWidth
                  label="Numéro de téléphone*"
                  value={formInput?.phone_number || ''}
                  error={!!!!formErrors?.data?.phone_number}
                  helperText={renderArrayMultiline(formErrors?.data?.phone_number)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  disablePortal
                  id="category"
                  options={top100Films}
                  renderInput={(params) => <TextField {...params} label="Catégorie" variant="standard" />}
                />
              </Grid>
              <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                <LoadingButton
                  loadingPosition="end"
                  endIcon={<SendIcon />}
                  loading={createClientMutation.isLoading}
                  variant="contained"
                  type="submit"
                >
                  Ajouter
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </>
      </div>
    </MainCard>
  );
};

ClientCreatePage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default ClientCreatePage;

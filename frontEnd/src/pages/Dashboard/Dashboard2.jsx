// src/pages/Dashboard/Dashboard2.jsx
import { Box, Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';

// Definindo os estilos com makeStyles
const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
    backgroundColor: '#f5f5f5',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    marginBottom: theme.spacing(2),
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    textAlign: 'center',
  },
  gridContainer: {
    marginTop: theme.spacing(3),
  },
  card: {
    minWidth: 250,
    margin: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  status: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  progress: {
    marginRight: theme.spacing(2),
  },
  bodyText: {
    marginTop: theme.spacing(3),
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#555',
  },
}));

// Componente Dashboard2
function Dashboard2() {
  const classes = useStyles(); // Usando os estilos definidos com makeStyles
  
  const data = {
    computerName: "COM-0006",
    status: "Offline",
    antivirusStatus: "Enabled",
  };

  return (
    <Box className={classes.container}>
      {/* Cabeçalho */}
      <Typography variant="h4" className={classes.header}>
        Visibilidade Completa do seu Ecosistema de TI - Dashboard 2
      </Typography>
      
      {/* Cards de informações */}
      <Grid container spacing={3} className={classes.gridContainer}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6">Status da Conectividade</Typography>
              <Box className={classes.status}>
                <CircularProgress className={classes.progress} size={24} color="secondary" />
                <Typography>{data.status}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6">Antivírus</Typography>
              <Box className={classes.status}>
                <Typography>{data.antivirusStatus}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6">Informações do Computador</Typography>
              <Box className={classes.status}>
                <Typography>{data.computerName}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Texto adicional para a segunda dashboard */}
      <Typography variant="body1" className={classes.bodyText}>
        Este é o conteúdo da segunda dashboard. Você pode personalizar mais elementos aqui.
      </Typography>
    </Box>
  );
}

export default Dashboard2;

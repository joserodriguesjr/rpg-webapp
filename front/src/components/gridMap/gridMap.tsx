import { Link, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { BattleStatus, Player } from '@/types/battle';
import { fetchUVTTFile, mountImagePath } from '@/api/api';
import CircularProgress from '@mui/material/CircularProgress';
import './GridMap.css';
import { Character } from '@/types/character';
import {
  UPDATE_BATTLE_STATUS,
  SUBSCRIBE_TO_BATTLE_STATUS,
  GET_BATTLE_STATUS,
  GET_CHARACTER,
} from '@/api/user/user-queries';
import { useMutation, useQuery, useSubscription } from '@apollo/client';

interface GridMapProps {
  admin?: boolean;
}

type UvttDATA = {
  format: number;
  resolution: Resolution;
  line_of_sight: Array<MapOrigin[]>;
  portals: Portal[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lights: any[];
  environment: Environment;
  image: string;
};

type Environment = {
  baked_lighting: boolean;
  ambient_light: string;
};

type MapOrigin = {
  x: number;
  y: number;
};

type Portal = {
  position: MapOrigin;
  bounds: MapOrigin[];
  rotation: number;
  closed: boolean;
  freestanding: boolean;
};

type Resolution = {
  map_origin: MapOrigin;
  map_size: MapOrigin;
  pixels_per_grid: number;
};

const GridMap: React.FC<GridMapProps> = ({ admin }) => {
  const [uvttData, setUVTTData] = useState<UvttDATA | null>(null);
  const [mapImage, setMapImage] = useState<HTMLImageElement | null>(null);
  const [rows, setRows] = useState<number>(12);
  const [cols, setCols] = useState<number>(10);
  const [cellSize, setCellSize] = useState<number>(34);

  const location = 'blank';
  const map = 'white';

  // const location = 'sagtar';
  // const map = 'QG_Noite';
  // const map = 'QG_PorDoSol';
  // const map = 'cave';

  // const location = 'vila';
  // const map = 'Vila_Amanhecendo';
  // const map = 'Vila_Tarde';
  // const map = 'Vila_PorDoSol';
  // const map = 'Vila_Noite';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUVTTFile(location, map);
        setUVTTData(data);
      } catch (error) {
        console.error('Error fetching UVTT file:', error);
        // Handle error appropriately, e.g., display error message to the user
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once

  // useEffect(() => {
  //   if (uvttData?.image) {
  //     const img = new Image();
  //     img.src = `data:image/png;base64,${uvttData.image}`;
  //     img.onload = () => {
  //       setMapImage(img);
  //     };
  //   }
  // }, [uvttData]);

  useEffect(() => {
    const handleResize = () => {
      // Calculate new cell size based on window size or any other factor
      const newSize = Math.min(window.innerWidth, window.innerHeight) * 0.04; // Example: 10% of min dimension
      setCellSize(newSize);
    };
    // Initial calculation
    handleResize();
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    // Cleanup function
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (uvttData) {
      const { resolution } = uvttData; // Destructure uvttData
      if (resolution) {
        // Check if resolution is not null
        const { map_size } = resolution; // Destructure map_size from resolution
        if (map_size) {
          // Check if map_size is not null
          const { x, y } = map_size; // Destructure x and y from map_size
          setCols(x);
          admin ? setRows(y + 4) : setRows(y);
        }
      }
    }
  }, [admin, uvttData]);

  const [battleStatus, setBattleStatus] = useState<BattleStatus>();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const { name } = useParams();
  const [character, setCharacter] = useState<Character | null>(null);
  const { loading: characterLoading } = useQuery(GET_CHARACTER, {
    variables: { name: name },
    onCompleted: (data) => {
      setCharacter(data.character);
    },
  });

  const { loading } = useQuery(GET_BATTLE_STATUS, {
    onCompleted: (data) => setBattleStatus(data.battleStatus),
  });

  useSubscription(SUBSCRIBE_TO_BATTLE_STATUS, {
    onData: (option) => setBattleStatus(option.data.data.battleStatus),
  });

  const [updateBattleStatus] = useMutation(UPDATE_BATTLE_STATUS);

  const grid: (Player | null)[][] = Array.from({ length: cols }, () =>
    Array(rows).fill(null),
  );

  useEffect(() => {
    if (battleStatus) {
      battleStatus.forEach((player) => {
        const { position } = player;
        if (
          position.row >= 0 &&
          position.row < rows &&
          position.col >= 0 &&
          position.col < cols
        ) {
          grid[position.row][position.col] = player;
        }
      });
    }
  }, [battleStatus, grid, rows, cols]);

  const handleCellClick = (row: number, col: number) => {
    if (!battleStatus) {
      return;
    }

    const player = battleStatus.find(
      (p) => p.position.row === row && p.position.col === col,
    );

    // Clicou em celula vazia sem ter clicado no seu personagem
    if (!player && !selectedPlayer) {
      return;
    }

    // Jogadores não podem mover outro jogador
    if (!selectedPlayer && player?.name !== character?.name && !admin) {
      return;
    }

    // Selecionando o jogador
    if (!selectedPlayer) {
      setSelectedPlayer(player!);
    }

    // Clicando em si mesmo após ter se selecionado
    if (selectedPlayer === player) {
      setSelectedPlayer(null);
    }

    // Movendo a celula escolhida (sem ser em cima de outro jogador)
    if (selectedPlayer && !player) {
      updateBattleStatus({
        variables: {
          battleStatus: {
            id: selectedPlayer.id,
            position: { row: row, col: col },
          },
        },
      });
      setSelectedPlayer(null);
    }
  };

  // TODO INVERTIDO
  const renderCellContent = (
    character: Character | undefined,
    row: number,
    col: number,
  ) => {
    if (!battleStatus) {
      return;
    }

    const player = battleStatus.find(
      (p) => p.position.row === row && p.position.col === col,
    );

    if (!player) {
      return (
        <div
          style={{
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            border: '0.3px solid #000000',
            // cursor: 'pointer',
          }}
          onClick={() => handleCellClick(row, col)}
        />
      );
    }

    function calculateHealthColor(healthPercentage: number) {
      const segment = 100 / 4;
      let segmentIndex = Math.floor(healthPercentage / segment);
      segmentIndex = segmentIndex === 4 ? 3 : segmentIndex;
      const colors = ['#C0392B', '#E67E22', '#F1C40F', '#27AE60'];
      return colors[segmentIndex];
    }

    const isSelectedCell = selectedPlayer === player ? 'selected-cell' : '';

    const healthPercentage = (player.healthCurrent / player.healthMax) * 100;
    const healthValue = (healthPercentage * 50) / 100;
    const energyPercentage = (player.energyCurrent / player.energyMax) * 100;
    const energyValue = (energyPercentage * 50) / 100;

    if (player.visible || character?.name === player.name || admin) {
      return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <CircularProgress
            variant="determinate"
            value={healthValue}
            size={cellSize + 'px'}
            style={{
              position: 'absolute',
              color: calculateHealthColor(healthPercentage),
              // top: '-1%',
              // right: '-1%',
            }}
            thickness={3}
            onClick={() => handleCellClick(row, col)}
          />
          <CircularProgress
            variant="determinate"
            value={energyValue}
            size={cellSize + 'px'}
            style={{
              position: 'absolute',
              color: '#4682B4',
              transform: 'scaleX(-1) rotate(-90deg)',
              // top: '-1%',
              // left: '-1%',
            }}
            thickness={3}
            onClick={() => handleCellClick(row, col)}
          />
          <img
            src={mountImagePath(player.icon)}
            alt={player.name}
            className={`rounded-full ${isSelectedCell}`}
            onClick={() => handleCellClick(row, col)}
          />
        </div>
      );
    } else {
      return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={mountImagePath(player.icon)}
            alt={player.name}
            className={`rounded-full ${isSelectedCell}`}
            onClick={() => handleCellClick(row, col)}
          />
        </div>
      );
    }
  };

  if (loading || characterLoading || uvttData === null) {
    return (
      <div className="flex flex-col items-center justify-between p-4">
        <CircularProgress />
        <div>Carregando...</div>
        <Link to={`/`}>
          <span>Voltar</span>
        </Link>
      </div>
    );
  }

  if ((!battleStatus || character == null) && !admin) {
    return null;
  }

  return (
    <>
      {!admin && (
        <div className="relative flex flex-col mb-60">
          <div className="flex items-center justify-between space-around p-4">
            <h1 className="text-4xl font-extrabold">
              <span
                style={{
                  display: 'block',
                  textAlign: 'left',
                }}
              >
                {character?.name}
              </span>
            </h1>
            <Link to={`/${character?.name}`} className="text-2xl">
              <span
                style={{
                  display: 'block',
                  textAlign: 'right',
                }}
              >
                Voltar
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* Grid */}
      <div
        className="flex flex-col"
        style={{
          position: 'absolute',
          overflow: 'hidden',
        }}
      >
        <div
          className={`flex justify-center items-center`}
          style={{
            zIndex: 1000,
          }}
        >
          {grid.map((col, colIndex) => (
            <div
              key={col
                .map((player) => (player ? player.name : colIndex))
                .join(',')}
            >
              {col.map((player, rowIndex) => (
                <div
                  key={player ? player.name : `${colIndex}-${rowIndex}`}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    cursor: 'pointer',
                    // border: '0.5px solid #000000',
                  }}
                  // TODO TA INVERTIDO TAMBEM
                  className={`${
                    rowIndex == uvttData.resolution.map_size.y
                      ? 'admin-allies-area'
                      : rowIndex == uvttData.resolution.map_size.y + 1
                        ? 'admin-sagtar-area'
                        : rowIndex == uvttData.resolution.map_size.y + 2
                          ? 'admin-monsters-area'
                          : rowIndex > uvttData.resolution.map_size.y + 2
                            ? 'admin-aliens-area'
                            : ''
                  }`}
                >
                  {renderCellContent(character!, colIndex, rowIndex)}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            gridTemplateColumns: `repeat(${cols})`,
            gridTemplateRows: `repeat(${rows})`,
          }}
        >
          <div
            className="bg-slate-800/60"
            // style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
          >
            {/* {uvttData.lights.map((light, index) => {
              const pixelX =
                (light.position.x / uvttData.resolution.map_size.x) * 100;
              const pixelY =
                (light.position.y / uvttData.resolution.map_size.y) * 100;

              const hexToRgb = (hex: string) => {
                hex = hex.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                return `rgba(${r}, ${g}, ${b}, ${light.intensity})`;
              };

              return (
                <div
                  key={`light-${index}`}
                  style={{
                    position: 'absolute',
                    width: `${(light.range / uvttData.resolution.map_size.x) * 100 * 2}%`,
                    height: `${(light.range / uvttData.resolution.map_size.y) * 100 * 2}%`,
                    borderRadius: '50%',
                    top: `${pixelY}%`,
                    left: `${pixelX}%`,
                    transform: 'translate(-50%, -50%)', // Center the light circle
                    backgroundImage: `radial-gradient(circle at center, ${hexToRgb(light.color)} 0%, rgba(255, 255, 255, 0) 50%)`,
                  }}
                />
              );
            })} */}
            <div
              // src={mapImage.src}
              // alt="Map"
              style={{
                mixBlendMode: 'overlay',
                top: uvttData.resolution.map_origin.y,
                left: uvttData.resolution.map_origin.x,
                // backgroundColor: 'white',
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export { GridMap };

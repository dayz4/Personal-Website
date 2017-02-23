import java.util.Random;


public class Bot extends Contestant{
	public static int[][] grid;
	public static int[][] offsets = { { SQUARE_SIZE, 0 }, { 0, -SQUARE_SIZE }, { -SQUARE_SIZE, 0 }, { 0, SQUARE_SIZE } };
	
	public Board board;
	
    private Random r = new Random();
    public int dir;
    public int xPos, yPos;
    public int nx, ny, px, py;
	private Routine routine;
	
	public Bot(){
		x[0] = BOARD_WIDTH/2;
		y[0] = 10;

		down = true;
		dir = 3;
		setNext(dir);
		
		grid = new int[BOARD_WIDTH][BOARD_HEIGHT];
        int[] k = new int[BOARD_WIDTH];
        
        //create the board
        for(int i=0; i<BOARD_HEIGHT; i++){
        	grid[i] = k;
        	for(int j=0; j<BOARD_WIDTH; j++){
        		grid[i][j] = j;
        		k[j] = i; 
        	}
        }
	}
	
	public void update(){
		System.out.println(routine);
		if (routine != null){
			if(routine.getState() == null){
				System.out.println("routine starting");
				routine.start();
			}
			System.out.println("telling routine to run act");
			routine.act(this, board);
		}
	}
	
	public int getDir(){
		return dir;
	}
	
	public void setDir(int dir){
		this.dir = dir;
	}
	
	public void findDirection(){
		if(dir == 0){
			right = true;
			left = false;
			up = false;
			down = false;
		}
		
		if(dir == 1){
			up = true;
			down = false;
			left = false;
			right = false;
		}
		
		if(dir == 2){
			left = true;
			right = false;
			up = false;
			down = false;
		}
		
		if(dir == 3){
			down = true;
			up = false;
			left = false;
			right = false;
		}
	}
	
	public void pick(){
    	//turn in the direction closest to a wall
    	System.out.println("picking");
    	int yd = yPos;
    	int ydCount = 0;
    	
       	int yu = yPos;
       	int yuCount = 0;
       	
       	int xr = xPos;
       	int xrCount = 0;
       	
       	int xl = xPos;
       	int xlCount = 0;
       	
       	while (yd < BOARD_HEIGHT){
       		yd++;
       		ydCount++;
       	}
       	while (yu > 0){
      		yu--;
      		yuCount++;
       	}
       	while (xr < BOARD_WIDTH){
       		xr++;
       		xrCount++;
       	}
       	while (xl > 0){
       		xl--;
       		xlCount++;
       	}
       	if ((dir == 0 && yuCount > ydCount) || (dir == 1 && xlCount > xrCount) || (dir == 2 && ydCount > yuCount) || (dir == 3 && xrCount > xlCount)){
       		System.out.println("def");
       		dir = (dir + 3) % 4;
       	}
       	else{
       		System.out.println("abc");
       		dir = (dir + 1) % 4;
      	}
    }

	
	public void checkCollision(){
		if(x[0]<0 || x[0] > BOARD_WIDTH-SQUARE_SIZE || y[0]<0 || y[0] > BOARD_HEIGHT-SQUARE_SIZE){
			collided = true;
			return;
		}
		
		for(int k = length-1; k>0; k--){
			if(x[0] == x[k] && y[0] == y[k]){
				collided = true;
				break;
			}
		}
	}
	
	public void setNext(int dir){
    	nx = x[0] + offsets[dir][0];
        ny = y[0] + offsets[dir][1];
	}
	
	public int getXPos(){
		return x[0];
	}
	
	public int getYPos(){
		return y[0];
	}
	
	public int getNX(){
		return nx;
	}
	
	public int getNY(){
		return ny;
	}
	
	public Routine getRoutine(){
		return routine;
	}
	
	public void setRoutine(Routine routine){
		this.routine = routine;
	}
	
	public boolean isCollided(){
		return collided;
	}
}
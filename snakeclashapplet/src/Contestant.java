import java.awt.Image;
import java.net.URL;

import javax.swing.ImageIcon;

public abstract class Contestant implements Commons{
	protected final int[] x = new int[ALL_DOTS];
	protected final int[] y = new int[ALL_DOTS];
	
	protected int length;
	
	protected Image head, square;
	
	protected boolean left, right, up, down;
	public boolean collided;
	
	public Contestant(){
		length = 1;
		left = false;
		right = false;
		
		collided = false;
	}
	
	public int getLength(){
		return length;
	}
	
	public void setLength(int length) {
		this.length = length;
	}
	
	public int[] getX(){
		return x;
	}
	
	public int getX(int pos){
		return x[pos];
	}
	
	public void setX(int x, int index){
		this.x[index] = x;
	}
	
	public int[] getY(){
		return y;
	}
	
	public int getY(int pos){
		return y[pos];
	}
	
	public void setY(int y, int index){
		this.y[index] = y;
	}
	
	public boolean getCollided(){
		return collided;
	}
}
